import React, {useState, useContext} from 'react';
import axios from 'axios';
import {signUpUrl} from '../firebase';
import AuthContext from '../auth-context';
//TODO: Refactor Login and SignUp components to be one
const SignUp = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const auth = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();
        const authData = {
            email: emailValue,
            password: passwordValue,
            returnSecureToken: true
        };
        axios.post(signUpUrl, authData)
             .then((res) => {
                 console.log("RES: ", res)
                 auth.login(res.data);
                 props.history.push('/retro')
             })
             .catch(error => console.log("ERROR: ", error));
    };

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
    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={submitHandler.bind(this)}>
                <input type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <input type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <input type="submit" value="Sign Up" />
            </form>
        </div>
    );
};

export default SignUp;