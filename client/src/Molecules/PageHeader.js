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

const PageHeader = ({ classes, title }) => (
  <section className={classes.pageHeader}>
    <div className="content">
      <Grid
        container
        direction="column"
        alignItems="flex-start"
        justify="center"
        style={{ height: '100%' }}
        spacing={24}
      >
        <Grid item xs={12} className={classes.flexBasisZero}>
          <Typography type="display1">{title}</Typography>
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
    backgroundColor: '#010101',
  },
  flexBasisZero: {
    flexBasis: 0,
  },
};

PageHeader.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.shape({
    pageHeader: PropTypes.string.required,
    flexBasisZero: PropTypes.string.required,
  }).isRequired,
};

PageHeader.defaultProps = {
  title: 'Page Title',
};

export default withStyles(styles)(PageHeader);
