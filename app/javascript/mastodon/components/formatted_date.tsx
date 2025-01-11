import type { DateTimeFormatOptions } from '@/mastodon/utils/intl_fixes';
import { intlFixes } from '@/mastodon/utils/intl_fixes';

type FormattedDateProps = DateTimeFormatOptions & {
  value: Date | string | undefined;
  className?: string;
};
export const FormattedDateWrapper = (props: FormattedDateProps) => {
  // TODO: What is this? react-intl's FormattedDate appears to accept undefined
  if (!props.value) return <time className={props.className} />;

  const date = new Date(props.value);
  const display = intlFixes.formatDate(date, props);
  return (
    <time dateTime={tryIsoString(props.value)} className={props.className}>
      {display}
    </time>
  );
};

const tryIsoString = (date?: string | number | Date): string => {
  if (!date) {
    return '';
  }
  try {
    return new Date(date).toISOString();
  } catch {
    return date.toString();
  }
};
