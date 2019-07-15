import React, { Component } from 'react';
import AppContainer from './routes';
import { Amplitude } from 'expo';
import config from './config';

class App extends Component {
  
  componentWillMount() {
    Amplitude.initialize(config.amplitudeKey);
  }

  render() {
    return (
      <AppContainer />
    );
  }
}

export default App;
