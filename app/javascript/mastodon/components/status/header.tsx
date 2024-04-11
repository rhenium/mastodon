import { useId } from 'react';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import IconPinned from '@/images/icons/icon_pinned.svg?react';
import { useAccount } from '@/mastodon/hooks/useAccount';
import { useCurrentAccountId } from '@/mastodon/hooks/useAccountId';
import type { AccountStatusShape } from '@/mastodon/models/status';

import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { DisplayName } from '../display_name';
import { useAccountHandle } from '../display_name/default';
import { Icon } from '../icon';
import { AccountLink, StatusLink } from '../link';
import { RelativeTimestamp } from '../relative_timestamp';
import { Skeleton } from '../skeleton';

import classes from './header.module.scss';
import { accountStatusLinkProps } from './utils';

interface StatusRedesignHeaderProps {
  status: Pick<
    AccountStatusShape,
    'id' | 'account' | 'created_at' | 'visibility' | 'mentions' | 'url'
  >;
  className?: string;
  featured?: boolean;
}

export const StatusRedesignHeader: React.FC<StatusRedesignHeaderProps> = ({
  status,
  className,
  featured,
}) => {
  const account = status.account;
  const handle = useAccountHandle(account);
  const currentAccountId = useCurrentAccountId();
  const firstMentionAccount = useAccount(
    status.mentions.find(({ id }) => id !== currentAccountId)?.id,
  );

  const handleId = useId();
  const accountLinkProps = accountStatusLinkProps(account);

  let displayName = (
    <AccountLink
      {...accountLinkProps}
      className={classes.nameLink}
      aria-describedby={handleId}
    >
      <DisplayName account={account} variant='noDomain' />
    </AccountLink>
  );
  if (status.visibility === 'private') {
    displayName = (
      <FormattedMessage
        id='status.header.to_followers'
        defaultMessage='{author} to Followers {count, plural, =0 {} one {+ # other} other {+ # others}}'
        description='Count is # of other people mentioned in the post'
        tagName='span'
        values={{ author: displayName, count: status.mentions.length }}
      />
    );
  } else if (status.visibility === 'direct' && status.mentions.length > 0) {
    if (status.account.id === currentAccountId && firstMentionAccount) {
      displayName = (
        <FormattedMessage
          id='status.header.message_from_me'
          defaultMessage='{author} to {name} {count, plural, =0 {} one {+ # other} other {+ # others}}'
          description='DisplayName is the author, count is # of other people mentioned in the post'
          tagName='span'
          values={{
            author: displayName,
            name: (
              <DisplayName account={firstMentionAccount} variant='simple' />
            ),
            // Minus two, as we're removing the current user as well.
            count: Math.max(status.mentions.length - 2, 0),
          }}
        />
      );
    } else {
      displayName = (
        <FormattedMessage
          id='status.header.message_to_me'
          defaultMessage='{author} to You {count, plural, =0 {} one {+ # other} other {+ # others}}'
          description='DisplayName is the author, count is # of other people mentioned in the post'
          tagName='span'
          values={{ author: displayName, count: status.mentions.length - 1 }}
        />
      );
    }
  }

  return (
    <header className={classNames(className, classes.root)}>
      <AccountLink
        {...accountLinkProps}
        role='presentation'
        tabIndex={-1}
        className={classes.avatar}
      >
        <Avatar account={account} size={null} />
      </AccountLink>

      <div className={classes.contents}>
        <p className={classes.name}>
          {displayName}
          &bull;
          <StatusLink
            status={status}
            account={account}
            reference='status'
            className={classes.date}
          >
            <RelativeTimestamp timestamp={status.created_at} />
          </StatusLink>
        </p>

        <p className={classes.handle}>
          <AccountLink
            {...accountLinkProps}
            role='presentation'
            tabIndex={-1}
            id={handleId}
          >
            {handle ?? <Skeleton width='7ch' />}
          </AccountLink>
        </p>
      </div>

      {featured && (
        <Badge
          className={classes.pinnedBadge}
          icon={<Icon id='pinned' icon={IconPinned} />}
          label={
            <FormattedMessage
              id='account.timeline.pinned'
              defaultMessage='Pinned'
            />
          }
        />
      )}
    </header>
  );
};
