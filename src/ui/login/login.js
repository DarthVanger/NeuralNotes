import React, {Component} from 'react';
import PropTypes from 'prop-types';

console.debug('login.js');
import thoughtStorage from 'storage/thought-storage';
import googleDriveApi from 'api/google-drive-api';
import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import {gapiAuthorize} from 'api/google-login';
import googleApiLoader from 'api/google-api-loader';
import './slide-1.png';
import './slide-2.png';
import './slide-3.png';
import './slide-4.png';
import './login.css';

export class LoginPage extends Component {
  state = {isGoogleApiInitialized: false};

  render() {
    const authHandler = this.state.isGoogleApiInitialized ? this.handleAuthClick : null;
    return (
      <div>
        <div className="container-fluid">
          <h3 style={{display: "inline-block"}}>NeuralNotes &mdash; organize your thoughts</h3>
          <a onClick={authHandler} className="btn btn-social btn-lg btn-google"
             style={{width: '250px', display: 'inline-block', marginLeft: '20px', float: 'right', marginTop: '15px'}}>
            <span className="fa fa-google"/>
            Sign in with Google
          </a>

          <div style={{height: '15px'}}/>

          <div style={{textAlign: 'center'}}>
            <div className="slide">
              <h2>Mind map your notes & files</h2>
              <div className="slide-text">
                <p>Your folders &amp; files as a mind map</p>
                <p>Your mind map is stored as folders &amp; file</p>
              </div>
              <img src="src/ui/login/slide-1.png" style={{width: '100%', maxWidth: '750px'}}/>
            </div>
            <div className="slide">
              <h2>Explore subfolders by moving screen around</h2>
              <div className="slide-text">
                <p>You can see the entire structure, not just one level</p>
              </div>
              <img src="src/ui/login/slide-2.png" style={{width: '100%', maxWidth: '750px'}}/>
            </div>
            <div className="slide">
              <h2>Frequently used folders are BIGGER</h2>
              <div className="slide-text">
                <p>Every time you use a folder it becomes bigger</p>
                <p>Old files you never use get smaller, drowning into deep memory</p>
              </div>
              <img src="src/ui/login/slide-3.png" style={{width: '100%', maxWidth: '750px'}}/>
            </div>
            <div className="slide">
              <h2>Single place for notes and files</h2>
              <div className="slide-text">
                <p>In NeuralNotes, every folder has a text file for the notes</p>
                <p>It is displayed in a built-in text editor when a folder is selected</p>
              </div>
              <img src="src/ui/login/slide-4.png" style={{width: '100%', maxWidth: '750px'}}/>
            </div>
          </div>

          <h2 style={{textAlign: 'center'}}>Sign up to NeuralNotes for free</h2>
          <a onClick={authHandler} className="btn btn-social btn-lg btn-google"
             style={{width: '250px', display: 'block', margin: '1em auto'}}>
            <span className="fa fa-google"/>
            Sign up with Google
          </a>
        </div>
      </div>
    );
  }

  componentWillMount() {
    googleApiLoader.load().then(() => this.setState({isGoogleApiInitialized: true}));
  }

  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  handleAuthClick = () => {
    console.debug('login.handleAuthClick()');
    let spinnerName = 'Loading google auth';
    siteGlobalLoadingBar.show(spinnerName);

    gapiAuthorize()
      .then(() => {
        console.debug('login.js: auth success! calling thoughtStorage.scanDrive()');
        siteGlobalLoadingBar.hide(spinnerName);
      })
      .then(googleDriveApi.loadDriveApi)
      .then(thoughtStorage.scanDrive)
      .then(() => {
        console.info('login: drive scanned, redirecting to the app main page');
        this.props.authorized();
      });

    return false;
  }
}

LoginPage.propTypes = {
  authorized: PropTypes.func.isRequired
};
