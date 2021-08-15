import { createMuiTheme } from '@material-ui/core/styles';

import { colors } from 'colors';

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
      button: colors.onSurfaceHighEmphasis,
    },
    text: {
      primary: colors.onSurfaceHighEmphasis,
      secondary: colors.onSurfaceMediumEmphasis,
      disabled: colors.onSurfaceDisabled,
      hint: colors.onSurfaceDisabled,
      icon: colors.onSurfaceDisabled,
    },
  },
  typography: {
    subtitle1: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: 0.15,
      color: colors.onSurfaceHighEmphasis,
    },
    subtitle2: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '24px',
      letterSpacing: 0.1,
      color: colors.onSurfaceMediumEmphasis,
    },
    h6: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '20px',
      lineHeight: '26px',
      letterSpacing: 0.15,
      color: colors.onSurfaceHighEmphasis,
    },
    body2: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: 0.25,
      color: colors.onSurfaceMediumEmphasis,
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
        // reset default background color
        backgroundColor: null,
        // use background instead of background color as some colors are implemented using
        // linear-gradient() to blend 2 colors
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
    MuiListItem: {
      root: {
        color: colors.onSurfaceHighEmphasis,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.divider,
      },
    },
    MuiMenuItem: {
      root: {
        background: colors.elevationOverlay08dp,
        minHeight: '32px',
      },
    },
    MuiDialogContent: {
      root: {
        background: colors.elevationOverlay08dp,
      },
    },
    MuiDialogContentText: {
      root: {
        color: colors.onSurfaceMediumEmphasis,
      },
    },
    MuiDialogActions: {
      root: {
        background: colors.elevationOverlay08dp,
      },
    },
    MuiDialogTitle: {
      root: {
        background: colors.elevationOverlay08dp,
        color: colors.onSurfaceMediumEmphasis,
      },
    },
  },
});
