import React from 'react';

import SvgIcon from '@material-ui/core/SvgIcon';
import { colors } from 'colors';

export function GoogleDriveIcon(props) {
  return (
    <SvgIcon width="18" height="18" viewBox="0 0 18 18" fill="none" {...props}>
      <g>
        <path
          d="M11.3661 1.08984H6.66223C6.47376 1.08984 6.29966 1.19025 6.20544 1.35352C6.11122 1.51678 6.11119 1.71759 6.20544 1.88086L11.2343 10.582H17.166L11.8224 1.35299C11.7281 1.19025 11.554 1.08984 11.3661 1.08984Z"
          fill={colors.onPrimaryHighEmphasis}
        />
        <path
          d="M5.41526 2.67001L0.0711195 11.8999C-0.0210602 12.0585 -0.0236266 12.2531 0.0633851 12.4148L2.34169 16.6336C2.43232 16.8015 2.6069 16.9076 2.79798 16.9101H2.80571C2.99369 16.9101 3.16828 16.8097 3.2625 16.6464L8.37752 7.79562L5.41526 2.67001Z"
          fill={colors.onPrimaryHighEmphasis}
        />
        <path
          d="M17.9255 11.8937C17.8307 11.7346 17.6587 11.6367 17.4728 11.6367H7.40372L4.35645 16.9102H15.1946C15.3882 16.9102 15.5664 16.8041 15.6585 16.6336L17.9369 12.4149C18.0249 12.2511 18.0208 12.0534 17.9255 11.8937Z"
          fill={colors.onPrimaryHighEmphasis}
        />
      </g>
    </SvgIcon>
  );
}
