import * as React from 'react';
import * as PropTypes from 'prop-types';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = createStyles({
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  root: {
    flexGrow: 1,
  },
});

interface StyledMenuAppBarProps extends WithStyles<typeof styles> {
  isLoggedIn: boolean;
}

class StyledMenuAppBar extends React.Component<StyledMenuAppBarProps> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Trip Planner
            </Typography>
            {this.props.isLoggedIn && <Button color="inherit">Users</Button>}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export const MenuAppBar = withStyles(styles)(StyledMenuAppBar);
