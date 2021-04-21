import styled from 'styled-components';
import { colors } from 'colors';

export const StyledNotFound = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
  background: ${colors.darkGray};
  height: ${'calc(100% - 101px)'};
`;
