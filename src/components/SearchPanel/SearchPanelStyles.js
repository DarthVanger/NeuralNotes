import { colors } from 'colors';
import { SearchIcon } from 'icons/Search/SearchIcon';
import styled from 'styled-components';

const CONTAINER_PADDING = 6;
const ICON_PADDING = CONTAINER_PADDING + 4;

export const StyledSearchPanelWrapper = styled.div`
  position: absolute;
  width: auto;
  background-color: ${colors.mainBackground};
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: ${CONTAINER_PADDING}px;
  border-radius: 8px;
`;

export const StyledInput = styled.input`
  width: 200px;
  line-height: 100%;
  padding: 0 8px 0 18px;
  border: 1px solid ${colors.textColor};
  border-radius: 8px;
  background-color: ${colors.menuBackground};
  color: ${colors.titleColor};
  outline: none;
`;

export const StyledIcon = styled(SearchIcon)`
  position: absolute;
  top: ${ICON_PADDING}px;
  left: ${ICON_PADDING}px;
  height: calc(100% - ${ICON_PADDING * 2}px);
`;
