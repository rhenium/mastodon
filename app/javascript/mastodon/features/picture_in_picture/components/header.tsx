import { defineMessages, useIntl } from 'react-intl';

import { useStatus } from '@/mastodon/hooks/useStatus';
import CloseIcon from '@/material-icons/400-24px/close.svg?react';
import { Avatar } from 'mastodon/components/avatar';
import { DisplayName } from 'mastodon/components/display_name';
import { IconButton } from 'mastodon/components/icon_button';
import { StatusLink } from 'mastodon/components/link';
import { useAppSelector } from 'mastodon/store';

const messages = defineMessages({
  close: { id: 'lightbox.close', defaultMessage: 'Close' },
});

interface Props {
  accountId: string;
  statusId: string;
  onClose: () => void;
}

export const Header: React.FC<Props> = ({ accountId, statusId, onClose }) => {
  const status = useStatus(statusId);
  const account = useAppSelector((state) => state.accounts.get(accountId));

  const intl = useIntl();

  if (!status) return null;
  if (!account) return null;

  return (
    <div className='picture-in-picture__header'>
      <StatusLink
        status={status}
        account={account}
        className='picture-in-picture__header__account'
      >
        <Avatar account={account} size={36} />
        <DisplayName account={account} />
      </StatusLink>

      <IconButton
        icon='times'
        iconComponent={CloseIcon}
        onClick={onClose}
        title={intl.formatMessage(messages.close)}
      />
    </div>
  );
};
