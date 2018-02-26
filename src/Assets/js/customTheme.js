/**
 * Customizations to the Material-ui theme
 */

import { createMuiTheme } from 'material-ui/styles';
import lightBlue from 'material-ui/colors/lightBlue';
import orange from 'material-ui/colors/orange';
import yellow from 'material-ui/colors/yellow';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: lightBlue[800],
    },
    secondary: {
      main: yellow[700],
      contrastText: '#000',
    },
    error: {
      main: orange[500],
    },
    tonalOffset: 0.2,
  },
  typography: {
    display1: {
      color: '#3A3A3A',
    },
    display2: {
      color: '#3A3A3A',
    },
    display3: {
      color: '#3A3A3A',
    },
    display4: {
      color: '#3A3A3A',
    },
    headline: {
      color: '#3A3A3A',
    },
    body1: {
      color: '#444',
    },
  },
});

export default theme;
