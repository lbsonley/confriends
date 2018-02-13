/**
 * PageHeader.js
 * @description - page header hero banner
 * @author - Ben Sonley
 */

import React from 'react';

// react extensions
import PropTypes from 'prop-types';

// material ui
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

const PageHeader = ({ classes, title, bgColor, color }) => (
  <section className={classes.pageHeader} style={{ backgroundColor: bgColor }}>
    <div className="content">
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        style={{ height: '100%' }}
      >
        <Grid item xs={12} className={classes.flexBasisZero}>
          <Typography variant="display2" style={{ color }}>
            {title}
          </Typography>
        </Grid>
      </Grid>
    </div>
  </section>
);

const styles = {
  pageHeader: {
    marginTop: 64,
    marginBottom: 32,
    height: 380,
  },
  flexBasisZero: {
    flexBasis: 0,
  },
};

PageHeader.propTypes = {
  title: PropTypes.string,
  bgColor: PropTypes.string,
  color: PropTypes.string,
  classes: PropTypes.shape({
    pageHeader: PropTypes.string.required,
    flexBasisZero: PropTypes.string.required,
  }).isRequired,
};

PageHeader.defaultProps = {
  title: 'Page Title',
  bgColor: '#010101',
  color: '#fff',
};

export default withStyles(styles)(PageHeader);
