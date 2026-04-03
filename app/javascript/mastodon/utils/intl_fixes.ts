export interface DateTimeFormatOptions {
  // Ignored, always shown
  year?: 'numeric';
  // Ignored, always shown with 2-digit numeric month
  month?: 'short' | 'long';
  // May be hidden, and if hidden, hour/minute/second are hidden too
  day?: 'numeric' | '2-digit';
  // hour/minute/second are always shown or hidden together
  hour?: '2-digit';
  minute?: '2-digit';
  // Missing means local time
  timeZone?: 'UTC';
}

// Example:
// import { intlFixes } from '@/mastodon/utils/intl_fixes';
// const s: string = intlFixes.formatDate(orig, { year: 'numeric' });
export const intlFixes = {
  formatDate: (
    value: string | number | Date,
    format_?: DateTimeFormatOptions,
  ) => {
    const format = format_ ?? {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    // UTC is only used in mastodon/components/admin/Retention.jsx
    const date = new Date(value);
    const ex =
      format.timeZone === 'UTC'
        ? ([
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
          ] as const)
        : ([
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ] as const);
    if (format.year && !format.month) return ex[0].toString();

    const monthString =
      ex[0].toString() + '-' + (ex[1] + 1).toString().padStart(2, '0');
    if (!format.day) return monthString;

    const dayString =
      ex[0].toString() +
      '-' +
      (ex[1] + 1).toString().padStart(2, '0') +
      '-' +
      ex[2].toString().padStart(2, '0');
    if (!format.hour && !format.minute) return dayString;

    return (
      dayString +
      ' ' +
      ex[3].toString().padStart(2, '0') +
      ':' +
      ex[4].toString().padStart(2, '0') +
      ':' +
      ex[5].toString().padStart(2, '0')
    );
  },
};
