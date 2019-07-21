import React, {useState, useContext} from 'react';
import axios from 'axios';
import AuthContext from '../auth-context';
import {loginUrl} from '../firebase';
//TODO: Refactor Login and SignUp components to be one
const Login = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const auth = useContext(AuthContext);

    const onChangeHandler = (event, value) => {
        switch (value) {
            case 'email':
                setEmailValue(event.target.value);
                break;
            case 'password':
                setPasswordValue(event.target.value);
                break;
            default:
                return;
        }
    };

    const submitHandler = event => {
        event.preventDefault();
        const authData = {
            email: emailValue,
            password: passwordValue,
            returnSecureToken: true
        };
        axios.post(loginUrl, authData)
             .then((res) => {
                 console.log("RES: ", res)
                 auth.login(res.data);
                 props.history.push('/retro')
             })
             .catch(error => console.log("ERROR: ", error));
    };

    return( 
        <div>
            <h1>Log In</h1>
            <form onSubmit={submitHandler.bind(this)}>
                <input type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <input type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <input type="submit" value="Log In" />
            </form>
        </div>
    );
};

export default Login;