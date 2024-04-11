import { useCallback } from 'react';

import { withRouter } from 'react-router';
import type { RouteComponentProps } from 'react-router';

import type { AccountShape } from 'mastodon/models/account';
import type { StatusShape } from 'mastodon/models/status';

type AccountLinkProps = RouteComponentProps & {
  // This could be just Account, but app/javascript/mastodon/components/avatar.tsx
  // may not have a complete object
  account?: Pick<AccountShape, 'acct' | 'id' | 'url'>;
  setHoverCard?: boolean;
  setTitle?: boolean;
  className?: string;
  children: React.ReactNode;
};
const AccountLinkWithRouter: React.FC<AccountLinkProps> = ({
  account,
  setHoverCard,
  setTitle,
  history,
  className,
  children,
}) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        history.push(`/@${account?.acct}`);
      }
    },
    [account, history],
  );

  return (
    <a
      href={account?.url}
      onClick={onClick}
      className={className}
      title={setTitle ? `@${account?.acct}` : undefined}
      data-hover-card-account={setHoverCard ? account?.id : undefined}
    >
      {children}
    </a>
  );
};
export const AccountLink = withRouter(AccountLinkWithRouter);

type StatusLinkProps = RouteComponentProps & {
  status: Pick<StatusShape, 'id' | 'url'>;
  account: Pick<AccountShape, 'acct' | 'id' | 'url'>;
  className?: string;
  children: React.ReactNode;
};
const StatusLinkWithRouter: React.FC<StatusLinkProps> = ({
  status,
  account,
  history,
  className,
  children,
}) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        history.push(`/@${account.acct}/${status.id}`);
      }
    },
    [account, history, status],
  );

  return (
    <a href={status.url ?? ''} onClick={onClick} className={className}>
      {children}
    </a>
  );
};
export const StatusLink = withRouter(StatusLinkWithRouter);
