import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../auth-context';
//TODO: Refactor Login and SignUp components to be one
const SignUp = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const auth = useContext(AuthContext);

    const submitHandler = event => {
        event.preventDefault();
        firebase.auth()
            .createUserWithEmailAndPassword(emailValue, passwordValue)
            .then((res) => {
                auth.login(true);
                props.history.push('/retroList');
            })
            .catch(function(error) {
                auth.login(false);
          });
        
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