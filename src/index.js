import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from './Assets/js/customTheme';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const ThemedApp = () => (
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<ThemedApp />, document.querySelector('main'));
registerServiceWorker();
