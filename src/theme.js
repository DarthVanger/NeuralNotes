import { createMuiTheme } from '@material-ui/core/styles';

import { colors } from './colors';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.violet,
    },
    secondary: {
      main: colors.turquoise,
      button: colors.buttonGray,
    },
  },
  typography: {
    headline6: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontZize: '19px',
      lineHeight: '22px',
    },
    subtitle1: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontZize: '16px',
      lineHeight: '24px',
      letterSpacing: 0.15,
      color: 'rgba(255, 255, 255, 0.87)',
    },
    subtitle2: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: 0.1,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    body2: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: 'rgba(255, 255, 255, 0.6)',
    },
    button: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
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
    MuiList: {
      root: {
        background: colors.elevationOverlay02dp,
      },
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.darkGray,
      },
    },
    MuiMenuItem: {
      root: {
        background: colors.dialogsGray,
        minHeight: '32px',
      },
    },
  },
});
