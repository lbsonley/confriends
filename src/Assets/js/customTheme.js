/**
 * Customizations to the Material-ui theme
 */

import { createMuiTheme } from 'material-ui/styles';
import blueGrey from 'material-ui/colors/blueGrey';
import lightBlue from 'material-ui/colors/lightBlue';

const theme = createMuiTheme({
  // palette: {
  //   type: 'dark',
  //   primary: lightBlue,
  //   secondary: blueGrey,
  // },
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
