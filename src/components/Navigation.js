import React, {useContext} from 'react';
import AuthContext from '../auth-context';
import {NavLink} from 'react-router-dom';

const Navigation = () => {
    const auth = useContext(AuthContext);
    const isAdmin = true; //TODO: Change this. Setting to true for development 
    const athenticatedOptions = (
        <div>
            <NavLink to="/retroList">View Retros</NavLink>
            <NavLink to="/retro">Current Retro</NavLink>
            {isAdmin ? <NavLink to="/adminPortal">Admin Portal</NavLink> : null}
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
            {auth.status ? athenticatedOptions : unauthenticatedOptions}
        </div>
    )
};

export default Navigation;