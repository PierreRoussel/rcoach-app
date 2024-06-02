import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS

export const grey = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

export const primary = {
  lighter: '#fda49b',
  light: '#fd7768',
  main: '#fc4e39',
  dark: '#fb2109',
  darker: '#b01403',
  contrastText: '#FFFFFF',
};

export const secondary = {
  lighter: '#fddaa5',
  light: '#fbc16a',
  main: '#fab54c',
  dark: '#f99c10',
  darker: '#c77905',
  contrastText: '#312e34',
};

export const info = {
  lighter: 'hsl(191, 40%, 62%)',
  light: 'hsl(191, 40%, 52%)',
  main: 'hsl(191, 40%, 42%)',
  dark: 'hsl(191, 40%, 32%)',
  darker: 'hsl(191, 40%, 22%)',
  contrastText: '#FFFFFF',
};

export const success = {
  lighter: '#b6e7b9',
  light: '#94db97',
  main: '#44c14a',
  dark: '#44c14a',
  darker: '#349d3a',
  contrastText: '#FFFFFF',
};

export const warning = {
  lighter: '#FFF5CC',
  light: '#FFD666',
  main: '#FFAB00',
  dark: '#B76E00',
  darker: '#7A4100',
  contrastText: grey[800],
};

export const error = {
  lighter: '#FFE9D5',
  light: '#FFAC82',
  main: '#FF5630',
  dark: '#B71D18',
  darker: '#7A0916',
  contrastText: '#FFFFFF',
};

export const common = {
  black: '#312e34',
  white: '#faf7ff',
};

export const action = {
  hover: alpha(grey[500], 0.08),
  selected: alpha(grey[500], 0.16),
  disabled: alpha(grey[500], 0.8),
  disabledBackground: alpha(grey[500], 0.24),
  focus: alpha(grey[500], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

const base = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  grey,
  common,
  divider: alpha(grey[500], 0.2),
  action,
};

// ----------------------------------------------------------------------

export function palette() {
  return {
    ...base,
    mode: 'light',
    text: {
      primary: grey[800],
      secondary: grey[600],
      disabled: grey[500],
    },
    background: {
      paper: '#FFFFFF',
      default: grey[100],
      neutral: grey[200],
    },
    action: {
      ...base.action,
      active: grey[600],
    },
  };
}
