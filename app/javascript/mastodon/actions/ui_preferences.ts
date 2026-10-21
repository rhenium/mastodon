import { createAction } from '@reduxjs/toolkit';

import type { LayoutStyle, TextSize } from '../settings';

export const changeLayoutStyle = createAction<LayoutStyle>(
  'uiPreferences/changeLayoutStyle',
);

export const changeTextSize = createAction<TextSize>(
  'uiPreferences/changeTextSize',
);

export const changeNopadding = createAction<boolean>(
  'uiPreferences/changeNopadding',
);
