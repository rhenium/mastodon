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
  children: React.ReactNode;
  reference?: string;
} & Pick<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'id' | 'className' | 'role' | 'tabIndex'
  >;
const AccountLinkWithRouter: React.FC<AccountLinkProps> = ({
  account,
  setHoverCard,
  setTitle,
  history,
  children,
  reference,
  id,
  className,
  role,
  tabIndex,
}) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        history.push(
          `/@${account?.acct}`,
          reference ? { reference } : undefined,
        );
      }
    },
    [account, history, reference],
  );

  return (
    <a
      href={account?.url}
      onClick={onClick}
      title={setTitle ? `@${account?.acct}` : undefined}
      data-hover-card-account={setHoverCard ? account?.id : undefined}
      data-hover-card-reference={reference}
      id={id}
      className={className}
      role={role}
      tabIndex={tabIndex}
    >
      {children}
    </a>
  );
};
export const AccountLink = withRouter(AccountLinkWithRouter);

type StatusLinkProps = RouteComponentProps & {
  status: Pick<StatusShape, 'id' | 'url'>;
  account: Pick<AccountShape, 'acct' | 'id' | 'url'>;
  children: React.ReactNode;
  reference?: string;
} & Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>;
const StatusLinkWithRouter: React.FC<StatusLinkProps> = ({
  status,
  account,
  history,
  children,
  reference,
  className,
}) => {
  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        history.push(
          `/@${account.acct}/${status.id}`,
          reference ? { reference } : undefined,
        );
      }
    },
    [account, history, status, reference],
  );

  return (
    <a href={status.url ?? ''} onClick={onClick} className={className}>
      {children}
    </a>
  );
};
export const StatusLink = withRouter(StatusLinkWithRouter);
