import { useId } from 'react';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import type { AccountStatusShape } from '@/mastodon/models/status';

import { Avatar } from '../../avatar';
import { DisplayName } from '../../display_name';
import { useAccountHandle } from '../../display_name/default';
import { AccountLink, StatusLink } from '../../link';
import { RelativeTimestamp } from '../../relative_timestamp';
import { Skeleton } from '../../skeleton';

import classes from './styles.module.scss';

interface StatusRedesignHeaderProps {
  status: Pick<
    AccountStatusShape,
    'id' | 'url' | 'account' | 'created_at' | 'visibility'
  >;
  children?: React.ReactNode;
  className?: string;
}

export const StatusRedesignHeader: React.FC<StatusRedesignHeaderProps> = ({
  status,
  children,
  className,
}) => {
  const account = status.account;
  const handle = useAccountHandle(account);

  const handleId = useId();
  const accountLinkProps = {
    account: account,
    reference: 'status',
  } satisfies Partial<React.ComponentProps<typeof AccountLink>>;

  let displayName = (
    <AccountLink
      {...accountLinkProps}
      className={classes.headerNameLink}
      aria-describedby={handleId}
    >
      <DisplayName account={account} variant='noDomain' />
    </AccountLink>
  );
  if (status.visibility === 'private') {
    displayName = (
      <FormattedMessage
        id='status.header.to_followers'
        defaultMessage='{displayName} to Followers'
        tagName='span'
        values={{ displayName }}
      />
    );
  }

  return (
    <header className={classNames(className, classes.header)}>
      <AccountLink
        {...accountLinkProps}
        role='presentation'
        tabIndex={-1}
        className={classes.headerAvatar}
      >
        <Avatar account={account} size={null} />
      </AccountLink>

      <div>
        <p className={classes.headerName}>
          {displayName}
          &bull;
          <StatusLink status={status} account={account} reference='status'>
            <RelativeTimestamp timestamp={status.created_at} />
          </StatusLink>
        </p>

        <p className={classes.headerHandle}>
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

      {children}
    </header>
  );
};
