import React, {useContext} from 'react';
import AuthContext from '../auth-context';
import {NavLink} from 'react-router-dom';

const Navigation = () => {
    const auth = useContext(AuthContext);
    return(
        <div>
            {auth.status ? (
            <div>
                <NavLink to="/retroList">View Retros</NavLink>
                <NavLink to="/retro">Current Retro</NavLink>
            </div>
            ) : (
            <div>
                <NavLink to="/login">Log In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
            </div>
            )}
        </div>
    )
};

export default Navigation;