import { FormattedMessage } from 'react-intl';

import { useAppSelector } from 'mastodon/store';

import { TimelineHint } from './timeline_hint';

interface RemoteHintProps {
  accountId?: string;
  onFetchRemoteOutbox?: () => void;
}

export const RemoteHint: React.FC<RemoteHintProps> = ({
  accountId,
  onFetchRemoteOutbox,
}) => {
  const account = useAppSelector((state) =>
    accountId ? state.accounts.get(accountId) : undefined,
  );
  const domain = account ? account.acct.split('@')[1] : undefined;
  if (!account || account.acct === account.username || !domain) {
    return null;
  }

  return (
    <div>
      <TimelineHint
        url={account.url}
        message={
          <FormattedMessage
            id='hints.profiles.posts_may_be_missing'
            defaultMessage='Some posts from this profile may be missing.'
          />
        }
        label={
          <FormattedMessage
            id='hints.profiles.see_more_posts'
            defaultMessage='See more posts on {domain}'
            values={{ domain: <strong>{domain}</strong> }}
          />
        }
      />
      {onFetchRemoteOutbox && (
        <div className='timeline-hint'>
          <button type='button' onClick={onFetchRemoteOutbox}>
            Outbox をよみにいってみる
          </button>
        </div>
      )}
    </div>
  );
};
