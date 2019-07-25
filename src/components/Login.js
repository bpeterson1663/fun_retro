import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../auth-context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
//TOOD: Refactor Snackbar into a single component
//TODO: Refactor Login and SignUp components to be one
const Login = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [message, setMessage] = useState('false');
    const [open, setOpen] = useState(false);
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
        firebase.auth()
            .signInWithEmailAndPassword(emailValue, passwordValue)
            .then((res) => {
                auth.login(true);
                props.match.params.id ?
                    props.history.push('/retro/'+props.match.params.id) :
                    props.history.push('/retroList');
            })
            .catch(function(error) {
                setOpen(true);
                setMessage(error.message)
                auth.login(false);
          });
    };

    const handleMessageClose = () => {
        setOpen(false);
        setMessage('');

    };
    return( 
        <Container>
            <h1>Log In</h1>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" color="secondary" variant="contained">Log In</Button>
            </form>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                variant="warning"
                open={open}
                autoHideDuration={6000}
                onClose={handleMessageClose}
                message={<span id="message-id">{message}</span>}
                action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={handleMessageClose}
                >
                    <CloseIcon />
                </IconButton>,
                ]}
            />
        </Container>
    );
};

export default Login;