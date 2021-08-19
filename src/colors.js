const surface = '#121212';

export const colors = {
  primary: '#4FC3F7',

  // Secondary is not used right now, but I picked it based on the primary color,
  // using the tool provided by Material (it generates the complementary color):
  // https://material.io/design/color/the-color-system.html#tools-for-picking-colors
  secondary: '#F7844F',

  surface,
  onPrimaryHighEmphasis: '#000000',
  onSurfaceHighEmphasis: 'rgba(255, 255, 255, 0.87)', // on #121212 surface it will be #E0E0E0
  onSurfaceMediumEmphasis: 'rgba(255, 255, 255, 0.6)', // on #121212 surface it will be #A0A0A0
  onSurfaceDisabled: 'rgba(255, 255, 255, 0.38)', // on #121212 surface it will be #6C6C6C
  elevationOverlay02dp: '#232323', // #121212 overlayed by white with 7% opacity
  elevationOverlay04dp: '#272727', // #121212 overlayed by white with 9% opacity
  elevationOverlay08dp: `linear-gradient(0deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12)), ${surface}`,
  divider: 'rgba(255, 255, 255, 0.12)',
};

export const nodeBorderColor = colors.onSurfaceHighEmphasis;
export const mindMapEdgeColor = nodeBorderColor;
export const mindMapBackground = colors.elevationOverlay02dp;
export const selectedNodeShadow = `drop-shadow(0px 0px 4px ${colors.primary}) drop-shadow(0px 0px 2px ${colors.primary}) drop-shadow(0px 0px 6px ${colors.primary})`;
export const snackbarBackground = '#E3E3E3'; // #121212 overlayed by white with 0.87 opcaity
