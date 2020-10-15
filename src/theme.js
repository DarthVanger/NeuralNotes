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
    },
    body2: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: 0.25,
    },
    button: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 16,
      letterSpacing: '1.25px',
      textTransform: 'uppercase',
    },
  },
});
