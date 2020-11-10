import React, { useCallback, useState } from 'react';

import PropTypes from 'prop-types';

import {
  StyledIcon,
  StyledInput,
  StyledSearchPanelWrapper,
} from 'components/SearchPanel/SearchPanelStyles';

import { debounce } from '../../helpers/debounce';

export const SearchPanelComponent = props => {
  const [query, setQuery] = useState('');
  const debouncedCallback = debounce(props.onChange, props.onChangeDelay);
  const onChange = useCallback(
    ({ target: { value } }) => {
      setQuery(value);
      debouncedCallback(value);
    },
    [setQuery],
  );

  return (
    <StyledSearchPanelWrapper>
      <StyledIcon />
      <StyledInput value={query} onChange={onChange} />
    </StyledSearchPanelWrapper>
  );
};

SearchPanelComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  onChangeDelay: PropTypes.number,
};

SearchPanelComponent.defaultProps = {
  onChangeDelay: 1000,
};
