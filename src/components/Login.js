import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../auth-context';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
//TOOD: Refactor Snackbar into a single component
//TODO: Refactor Login and SignUp components to be one
const useStyles = makeStyles(theme => ({
    inputField: {
      margin: theme.spacing(2),
    },
    placeHolder: {
        height: 5
    },
    submit:{
        display: 'block',
        margin: 'auto'
    },
}));
const Login = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [message, setMessage] = useState('false');
    const [open, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const auth = useContext(AuthContext);
    const classes = useStyles();

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
        setLoading(true);
        event.preventDefault();
        firebase.auth()
            .signInWithEmailAndPassword(emailValue, passwordValue)
            .then((res) => {
                auth.login(true);
                props.match.params.id ?
                    props.history.push('/retro/'+props.match.params.id) :
                    props.history.push('/retroList');
            })
            .catch((error) => {
                setOpen(true);
                setMessage(error.message)
                auth.login(false);
            })
            .finally(() => setLoading(false));
    };

    const handleMessageClose = () => {
        setOpen(false);
        setMessage('');
    };

    return( 
        <Container>
            {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
            <h1>Super Fun Retro</h1>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField className={classes.inputField} type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField className={classes.inputField}  type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" color="secondary" variant="contained" className={classes.submit}>Log In</Button>
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