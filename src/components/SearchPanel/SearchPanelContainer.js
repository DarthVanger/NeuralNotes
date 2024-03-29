import { connect } from 'react-redux';
import { makeAction } from 'redux-store';

import { SEARCH_QUERY_CHANGED_ACTION } from 'components/SearchPanel/SearchPanelActions';
import { SearchPanelComponent } from 'components/SearchPanel/SearchPanelComponent';

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({
  onChange: query => makeAction(SEARCH_QUERY_CHANGED_ACTION, query),
});

export const SearchPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPanelComponent);
