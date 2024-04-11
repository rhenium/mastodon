import type { AccountLink } from '@/mastodon/components/link';
import type { AccountShape } from '@/mastodon/models/account';
import type { AccountStatusShape } from '@/mastodon/models/status';

import type { StatusImageAttachmentJSON } from './types';

export function statusLink({
  account,
  id,
}: Pick<AccountStatusShape, 'account' | 'id'>) {
  return `/@${account.acct}/${id}`;
}

export function accountStatusLinkProps(
  account: Pick<AccountShape, 'acct' | 'id' | 'url'>,
) {
  return {
    account: account,
    reference: 'status',
    setHoverCard: true,
    'data-id': account.id,
  } satisfies Partial<React.ComponentProps<typeof AccountLink>>;
}

export function attachmentAspectRatio(
  attachment?: Pick<StatusImageAttachmentJSON, 'meta'>,
) {
  const width = attachment?.meta?.original?.width;
  const height = attachment?.meta?.original?.height;

  if (!width || !height) {
    return undefined;
  }

  return `${width} / ${height}`;
}
