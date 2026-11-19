import React, { useCallback } from 'react';

import { defineMessages, useIntl } from 'react-intl';

import {
  changeLayoutStyle,
  changeNopadding,
  changeTextSize,
} from 'mastodon/actions/ui_preferences';
import type { LayoutStyle, TextSize } from 'mastodon/settings';
import { useAppDispatch, useAppSelector } from 'mastodon/store/typed_functions';

import classes from './footer_links.module.scss';

const messages = defineMessages({
  ui_preferences: {
    id: 'ui_preferences.ui_preferences',
    defaultMessage: 'UI preferences [nnn]:',
  },
  layout: { id: 'ui_preferences.style', defaultMessage: 'Layout' },
  compact: { id: 'ui_preferences.style_compact', defaultMessage: 'Compact' },
  default: { id: 'ui_preferences.style_default', defaultMessage: 'Default' },
  textSize: { id: 'ui_preferences.text_size', defaultMessage: 'Text size' },
  smallest: {
    id: 'ui_preferences.text_size_smallest',
    defaultMessage: 'Smallest',
  },
  small: { id: 'ui_preferences.text_size_small', defaultMessage: 'Small' },
  medium: { id: 'ui_preferences.text_size_medium', defaultMessage: 'Medium' },
  large: {
    id: 'ui_preferences.text_size_large',
    defaultMessage: 'Large (Default)',
  },
  largest: {
    id: 'ui_preferences.text_size_largest',
    defaultMessage: 'Largest',
  },
});

const SelectSection = <T extends keyof typeof messages>({
  labelKey,
  value,
  options,
  onChange,
}: {
  labelKey: keyof typeof messages;
  value: T;
  options: readonly T[];
  onChange: (option: T) => void;
}) => {
  const intl = useIntl();
  const handleChange = React.useCallback(
    (e: { target: HTMLSelectElement }) => {
      onChange(e.target.value as T);
    },
    [onChange],
  );

  return (
    <section
      style={{
        flex: '1',
        display: 'flex',
        justifyContent: 'stretch',
        alignItems: 'baseline',
      }}
    >
      <label>{intl.formatMessage(messages[labelKey])}</label>
      <select
        className='compose-form__poll__select__value'
        style={{ flex: '1', textAlign: 'right', backgroundColor: 'unset' }}
        value={value}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {intl.formatMessage(messages[option])}
          </option>
        ))}
      </select>
    </section>
  );
};

export const UIPreferences: React.FC = () => {
  const intl = useIntl();
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.uiPreferences);

  const layoutStyles = ['default', 'compact'] as const satisfies LayoutStyle[];
  const handleChangeLayoutStyle = useCallback(
    (option: LayoutStyle) => {
      dispatch(changeLayoutStyle(option));
    },
    [dispatch],
  );

  const textSizes = [
    'smallest',
    'small',
    'medium',
    'large',
    'largest',
  ] as const satisfies TextSize[];
  const handleChangeTextSize = useCallback(
    (option: TextSize) => {
      dispatch(changeTextSize(option));
    },
    [dispatch],
  );

  const handleChangeNopadding = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(changeNopadding(e.target.checked));
    },
    [dispatch],
  );

  return (
    <div className={classes.root}>
      <section>
        <h2 className={classes.heading}>
          {intl.formatMessage(messages.ui_preferences)}
        </h2>
        {/*
      <SelectSection
        labelKey='layout'
        value={state.layoutStyle}
        options={layoutStyles}
        onChange={handleChangeLayoutStyle}
      />
      <SelectSection
        labelKey='textSize'
        value={state.textSize}
        options={textSizes}
        onChange={handleChangeTextSize}
      />*/}
        <label>
          <input
            type='checkbox'
            checked={state.nopadding}
            onChange={handleChangeNopadding}
          />
          nopadding
        </label>
      </section>
    </div>
  );
};
