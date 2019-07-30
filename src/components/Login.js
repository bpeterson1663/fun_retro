import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../auth-context';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import {Link} from 'react-router-dom';

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
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
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
    let retroId = null;
    if(props.location && props.location.state){
        retroId = props.location.state.retroId;
    }  
    if(props.match.params.id){
        retroId = props.match.params.id;
    }
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
                    retroId ? props.history.push('/retro/'+retroId) : props.history.push('/retroList');
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
            <Typography variant="h3">Super Fun Retro</Typography>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField className={classes.inputField} type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField className={classes.inputField}  type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" color="secondary" variant="contained" className={classes.submit}>Log In</Button>
            </form>
            <Link
                to={{
                    pathname: "/signup",
                    state: {retroId: retroId}
                }}
            > Signup </Link>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleMessageClose}
            >
                <SnackbarContent
                    onClose={handleMessageClose}
                    variant="warning"
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                        <ErrorIcon />
                        {message}
                        </span>
                    }
                    className={classes.error}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={handleMessageClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </Snackbar>
        </Container>
    );
};

export default Login;