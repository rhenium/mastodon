# syntax=docker/dockerfile:1.4

# Prepare node
FROM node:20-bookworm-slim as node

# Prepare a base image for building Ruby and for installing gems which may
# require native extensions
FROM debian:bookworm-slim as build-deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential curl ca-certificates \
        pkg-config

# Build ruby
FROM build-deps as ruby
RUN apt-get install -y --no-install-recommends \
        bison rustc \
        libffi-dev libgmp-dev libjemalloc-dev libncurses-dev libreadline-dev libssl-dev libyaml-dev zlib1g-dev

WORKDIR /root/ruby
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl -L https://cache.ruby-lang.org/pub/ruby/3.3/ruby-3.3.0.tar.gz | tar xz --strip-components=1
RUN ./configure \
        --prefix=/opt/ruby \
        --disable-install-doc \
        --with-jemalloc \
        --enable-yjit \
        && \
    make -j8 && \
    make install

# Install runtime dependencies
FROM build-deps as build
RUN apt-get install -y --no-install-recommends \
        git \
        libffi-dev libgmp-dev libjemalloc-dev libncurses-dev libreadline-dev libssl-dev libyaml-dev zlib1g-dev \
        libicu-dev \
        libidn-dev \
        libpq-dev \
        python3 \
        shared-mime-info

COPY --link --from=ruby /opt/ruby /opt/ruby
COPY --link --from=node /usr/local/bin /usr/local/bin
COPY --link --from=node /usr/local/lib /usr/local/lib
ENV PATH="${PATH}:/opt/ruby/bin"

WORKDIR /opt/mastodon

COPY Gemfile* package.json yarn.lock .yarnrc.yml /opt/mastodon/
COPY streaming/package.json /opt/mastodon/streaming/
COPY .yarn /opt/mastodon/.yarn

RUN bundle config set --local deployment 'true' && \
    bundle config set --local without 'development test' && \
    bundle config set silence_root_warning true && \
    bundle install -j8

# I have no idea what this is for, but builds fails without it.
# Taken from Mastodon's original Dockerfile.
# > EEXIST: file already exists, symlink '../lib/node_modules/corepack/dist/yarn.js' -> '/usr/local/bin/yarn'
RUN rm /usr/local/bin/yarn* && \
    corepack enable && \
    corepack prepare --activate && \
    yarn workspaces focus --all --production

# Build the final image
FROM debian:bookworm-slim
ARG UID="991"
ARG GID="991"

RUN groupadd -g "${GID}" mastodon && \
    useradd -l -u "$UID" -g "${GID}" -m -d /opt/mastodon mastodon && \
    ln -s /opt/mastodon /mastodon
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        tzdata \
        libffi8 libgmp10 libjemalloc2 libncurses6 libreadline8 openssl libyaml-0-2 zlib1g \
        libicu72 \
        libidn12 \
        libpq5 \
        file \
        imagemagick \
        ffmpeg \
        # Docker dependencies
        procps \
        wget \
        tini

COPY --link --from=ruby /opt/ruby /opt/ruby
COPY --link --from=node /usr/local/bin /usr/local/bin
COPY --link --from=node /usr/local/lib /usr/local/lib
RUN rm /usr/local/bin/yarn* && \
    corepack enable
COPY --chown=mastodon:mastodon . /opt/mastodon
COPY --chown=mastodon:mastodon --from=build /opt/mastodon /opt/mastodon
ENV PATH="${PATH}:/opt/ruby/bin:/opt/mastodon/bin"

ENV RAILS_ENV="production" \
    NODE_ENV="production" \
    RAILS_SERVE_STATIC_FILES="true" \
    RUBY_YJIT_ENABLE="1"

# Set the run user
USER mastodon
WORKDIR /opt/mastodon

# Precompile assets
RUN OTP_SECRET=precompile_placeholder SECRET_KEY_BASE=precompile_placeholder rails assets:precompile

# Set the work dir and the container entry point
ENTRYPOINT ["/usr/bin/tini", "--"]
EXPOSE 3000 4000
