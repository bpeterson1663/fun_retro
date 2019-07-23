import React, {useContext} from 'react';
import AuthContext from '../auth-context';
import {NavLink} from 'react-router-dom';

const Navigation = () => {
    const auth = useContext(AuthContext);
    const athenticatedOptions = (
        <div>
            <NavLink to="/retroList">View Retros</NavLink>
            <NavLink to="/adminPortal">Admin Portal</NavLink>
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