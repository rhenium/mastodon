import { createReducer } from '@reduxjs/toolkit';

import {
  changeLayoutStyle,
  changeTextSize,
} from 'mastodon/actions/ui_preferences';
import type { LayoutStyle, TextSize } from 'mastodon/settings';
import { uiPreferencesSettings } from 'mastodon/settings';

interface UIPreferencesState {
  layoutStyle: LayoutStyle;
  textSize: TextSize;
}

function getInitialState(): UIPreferencesState {
  return {
    layoutStyle: uiPreferencesSettings.get('layout_style') ?? 'default',
    textSize: uiPreferencesSettings.get('text_size') ?? 'large',
  };
}

export const uiPreferencesReducer = createReducer(
  getInitialState,
  (builder) => {
    builder.addCase(changeLayoutStyle, (state, { payload }) => {
      state.layoutStyle = payload;
      uiPreferencesSettings.set('layout_style', payload);
    });
    builder.addCase(changeTextSize, (state, { payload }) => {
      state.textSize = payload;
      uiPreferencesSettings.set('text_size', payload);
    });
  },
);
