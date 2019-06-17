import { connect } from 'react-redux';
import { AppComponent } from 'components/App/AppComponent';
import { action } from 'sagas';
import { CHANGE_PAGE_ACTION } from 'components/App/AppActions';

const mapStateToProps = ({ app: { page } }) => ({
  page
});

const mapDispatchToProps = () => ({
  changePage(page) {
    action(CHANGE_PAGE_ACTION, page);
  }
});

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppComponent);
