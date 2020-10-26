import { createMuiTheme } from '@material-ui/core/styles';

import { colors } from './colors';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.violet,
    },
    secondary: {
      main: colors.turquoise,
    },
  },
  typography: {
    headline6: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontZize: 19,
      lineHeight: '22px',
    },
    subtitle1: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontZize: 16,
      lineHeight: '24px',
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '24px',
      letterSpacing: 0.1,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    body2: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    button: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '16px',
      letterSpacing: '1.25px',
      textTransform: 'uppercase',
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: null,
        background: colors.elevationOverlay04dp,
      },
    },
  },
});
