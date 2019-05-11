import React, { Component } from 'react';
import PropTypes from 'prop-types';
import slide1 from 'components/LoginPage/images/slide-1.png';
import slide2 from 'components/LoginPage/images/slide-2.png';
import slide3 from 'components/LoginPage/images/slide-3.png';
import slide4 from 'components/LoginPage/images/slide-4.png';

export class LoginPageComponent extends Component {
  render() {
    const authHandler = this.props.isGoogleApiInitialized ? this.props.requestAuthorization : null;
    return (
      <div>
        <div className="container-fluid">
          <h3 style={{ display: "inline-block" }}>NeuralNotes &mdash; organize your thoughts</h3>
          <a onClick={authHandler} className="btn btn-social btn-lg btn-google"
             style={{ width: '250px', display: 'inline-block', marginLeft: '20px', float: 'right', marginTop: '15px' }}>
            <span className="fa fa-google"/>
            Sign in with Google
          </a>

          <div style={{ height: '15px' }}/>

          <div style={{ textAlign: 'center' }}>
            <div className="slide">
              <h2>Mind map your notes & files</h2>
              <div className="slide-text">
                <p>Your folders &amp; files as a mind map</p>
                <p>Your mind map is stored as folders &amp; file</p>
              </div>
              <img src={slide1} style={{ width: '100%', maxWidth: '750px' }}/>
            </div>
            <div className="slide">
              <h2>Explore subfolders by moving screen around</h2>
              <div className="slide-text">
                <p>You can see the entire structure, not just one level</p>
              </div>
              <img src={slide2} style={{ width: '100%', maxWidth: '750px' }}/>
            </div>
            <div className="slide">
              <h2>Frequently used folders are BIGGER</h2>
              <div className="slide-text">
                <p>Every time you use a folder it becomes bigger</p>
                <p>Old files you never use get smaller, drowning into deep memory</p>
              </div>
              <img src={slide3} style={{ width: '100%', maxWidth: '750px' }}/>
            </div>
            <div className="slide">
              <h2>Single place for notes and files</h2>
              <div className="slide-text">
                <p>In NeuralNotes, every folder has a text file for the notes</p>
                <p>It is displayed in a built-in text editor when a folder is selected</p>
              </div>
              <img src={slide4} style={{ width: '100%', maxWidth: '750px' }}/>
            </div>
          </div>

          <h2 style={{ textAlign: 'center' }}>Sign up to NeuralNotes for free</h2>
          <a onClick={authHandler} className="btn btn-social btn-lg btn-google"
             style={{ width: '250px', display: 'block', margin: '1em auto' }}>
            <span className="fa fa-google"/>
            Sign up with Google
          </a>
        </div>
      </div>
    );
  }
}

LoginPageComponent.propTypes = {
  isGoogleApiInitialized: PropTypes.bool.isRequired,
  requestAuthorization: PropTypes.func.isRequired
};
