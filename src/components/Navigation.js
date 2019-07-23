import React, {useContext} from 'react';
import AuthContext from '../auth-context';
import {NavLink, Link} from 'react-router-dom';
import firebase from 'firebase';

const Navigation = (props) => {
    const auth = useContext(AuthContext);
    const handleLogOut = () => {
        firebase.auth().signOut().then(function() {
            auth.login(false)
          }).catch(function(error) {
            console.log("error: ", error);
          });
    };
    const athenticatedOptions = (
        <div>
            <NavLink to="/retroList">Retro List</NavLink>
            <Link to="/login" onClick={handleLogOut.bind(this)}>Log Out</Link>
        </div>
    );
    const unauthenticatedOptions = (
        <div>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
        </div>
    )
    return(
        <div>
            {auth.userId ? athenticatedOptions : unauthenticatedOptions}
        </div>
    )
};

export default Navigation;