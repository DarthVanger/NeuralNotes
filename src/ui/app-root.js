import thoughtsMindMapView from 'thought/view-thoughts/thoughts-mind-map-view';
import thoughtStorage from 'storage/thought-storage';
import controlsHelp from 'ui/controls-help';
import thoughtContentEditor from 'ui/thought-content-editor';
import './layout.css';
import React, { Component } from 'react';
import { LoginPage } from './login/login';
import { Switch, Route } from 'react-router-dom';

let element;

function render(props) {
 // element = document.getElementById('app');
 // element.style.position = 'relative';
 // element.style.height = '100%';
 // 
 // switch (props.page) {
    //case 'login':
    //  //renderLoginPage();
    //  break;
    //case 'notes':
    //  renderNotesPage();
    //  break;
    //default:
    //  throw new Error('unknown page: ', page);
    //}
//
    //function renderLoginPage() {
    //  element.append(loginPage.render({
    //    redirectToNotesPage: function () {
    //    loginPage.unmount();
    //    renderNotesPage();
    //  }
    //}));
  //}
  
  //function renderNotesPage() {
  //  let selectedThoughtId = thoughtStorage.getRoot().id;
  //  let selectedThought = thoughtStorage.findThoughtById(selectedThoughtId);
  //  controlsHelp.render();
//
  //  element.append(thoughtContentEditor.render());
  //  
  //  element.append(thoughtsMindMapView.render({
  //    thoughts: thoughtStorage.getThoughts(),
  //    selectedThought: selectedThought,
  //    selectedThoughtId: selectedThoughtId
  //  }));
  //}
}

export class App extends Component {
  constructor() {
    super();
  }

  render() {
    // methodology for react migration:
    // 1. make login page into a component in its own html file
    // 2. make notes pages into a component in its own html file
    // 3. component is changed depending on the state and returned below and delete all unnecessary html files
    // 4. Once all is migrated to react, use React Router for page navigation
    return (
      <div>
        <Switch>
          <Route exact path='/' component={LoginPage} />
          <Route exact path='/notes' component={()=>(<div>hello world</div>)} />
        </Switch>
      </div>
    )
  }
}

export default {render};