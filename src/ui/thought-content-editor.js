import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import siteGlobalLoadingBar from 'ui/spinner/site-global-loading-bar';
import thoughtStorage from 'storage/thought-storage';
import uiErrorNotification from 'ui/ui-error-notification';

const REAL_TIME_SAVING_INTERVAL_MS = 1000;
const spinner = siteGlobalLoadingBar.create('note text editor');

export class ThoughtContentEditor extends Component {
  state = {
    text: '',
    noteText: ''
  };

  textAreaRef = React.createRef();

  debouncedUpdate = _.debounce(this.updateThoughtContent, REAL_TIME_SAVING_INTERVAL_MS);

  render() {
    const { text } = this.state;

    const { note, note: { isNote } } = this.props;
    const link = thoughtStorage.getLinkToThought(note);

    return (
      <div className="selected-thought-content">
        {isNote ? (
          <textarea
            ref={this.textAreaRef}
            className="thought-content__textarea"
            onChange={this.onChange}
            placeholder="Your note..."
            value={text}
          />
        ) : (
          <a
            className="btn btn-primary btn-lg"
            style={{ display: 'block' }}
            target="_blank"
            rel="noopener noreferrer"
            href={link}
          >
            Open in Google Drive
          </a>
        )}
      </div>
    );
  }

  onChange = () => {
    this.setState({ text: this.textAreaRef.current.value });
    this.debouncedUpdate();
  };

  static getDerivedStateFromProps({ noteText }, state) {
    console.log('Load thought');
    if (noteText !== state.noteText) {
      return {
        text: noteText,
        noteText
      }
    }
    return null;
  }

  updateThoughtContent() {
    console.debug('ThoughtContentController.updateThoughtContent()');
    let savingThoughtContentSpinner = spinner.create('saving thought');
    savingThoughtContentSpinner.show();

    this.props.note.content = this.textAreaRef.current.value;

    console.debug('RealtimeSaving: Save thought content: currentViewedThought: ', this.props.note);

    return thoughtStorage.update(this.props.note)
      .catch(function (error) {
        uiErrorNotification.show('Failed to save thought content');
        console.error(error);
      })
      .finally(function () {
        savingThoughtContentSpinner.hide();
      });
  }
}

ThoughtContentEditor.propTypes = {
  note: PropTypes.object.isRequired,
  noteText: PropTypes.string.isRequired
};
