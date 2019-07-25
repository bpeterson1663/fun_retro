import React, {useContext} from 'react';
import AuthContext from '../auth-context';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import firebase from 'firebase';
const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
  }));
const Navigation = (props) => {
    const auth = useContext(AuthContext);
    const handleLogOut = () => {
        firebase.auth().signOut().then(function() {
            auth.login(false)
          }).catch(function(error) {
            console.log("error: ", error);
          });
    };
    const classes = useStyles();
    const athenticatedOptions = (
        <div>
            <Link to="/retroList" style={{ textDecoration: 'none' }}><Button color="secondary" variant="contained" className={classes.button}>Retro List</Button></Link>
            <Link to="/login" style={{ textDecoration: 'none' }} onClick={handleLogOut.bind(this)}><Button color="secondary" variant="contained" className={classes.button}>Log Out</Button></Link>
        </div>
    );
    const unauthenticatedOptions = (
        <div>
            <Link to="/login" style={{ textDecoration: 'none' }}><Button color="secondary" variant="contained" className={classes.button}>Log In</Button></Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}><Button color="secondary" variant="contained" className={classes.button}>Sign Up</Button></Link>
        </div>
    )
    return(
        <AppBar position="static" style ={{padding:'0px,0px,0px,0px'}} >
            <Toolbar>
                {auth.userId ? athenticatedOptions : unauthenticatedOptions}
            </Toolbar>
        </AppBar>
    )
};

export default Navigation;