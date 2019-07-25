import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../auth-context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
                props.match.params.id ?
                    props.history.push('/retro/'+props.match.params.id) :
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
                <TextField type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" value="Sign Up" >Sign Up</Button>
            </form>
        </div>
    );
};

export default SignUp;