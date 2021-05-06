import { createMuiTheme } from '@material-ui/core/styles';

import { colors } from 'colors';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primaryColor,
    },
    secondary: {
      main: colors.secondaryColor,
      button: colors.titleColor,
    },
  },
  typography: {
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: 0.15,
      color: colors.titleColor,
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: 0.1,
      color: colors.textColor,
    },
    h6: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '26px',
      letterSpacing: 0.15,
      color: colors.titleColor,
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: colors.textColor,
    },
    button: {
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
        background: colors.barBackground,
      },
    },
    MuiList: {
      root: {
        background: colors.mainBackground,
      },
      padding: {
        paddingTop: 0,
        paddingBottom: 0,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.menuSelectBackground,
      },
    },
    MuiMenuItem: {
      root: {
        background: colors.menuBackground,
        minHeight: '32px',
      },
    },
    MuiDialogContent: {
      root: {
        background: colors.menuBackground,
      },
    },
    MuiDialogContentText: {
      root: {
        color: colors.textColor,
      },
    },
    MuiDialogActions: {
      root: {
        background: colors.menuBackground,
      },
    },
    MuiDialogTitle: {
      root: {
        background: colors.menuBackground,
        color: colors.textColor,
      },
    },
  },
});
