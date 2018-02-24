import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const LinkButton = props => {
  const { classes, inlineStyles, href, target } = props;
  return (
    <Button
      color="primary"
      href={href}
      className={classes.link}
      style={inlineStyles}
      target={target}
    >
      {props.children}
    </Button>
  );
};

LinkButton.propTypes = {
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired,
  }).isRequired,
  inlineStyles: PropTypes.shape({
    marginLeft: PropTypes.number,
    textTransform: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  target: PropTypes.string,
};

LinkButton.defaultProps = {
  target: '_self',
  inlineStyles: {},
};

const styles = {
  link: {
    marginTop: 0,
    paddingLeft: 0,
    textTransform: 'capitalize',
  },
};

export default withStyles(styles)(LinkButton);
