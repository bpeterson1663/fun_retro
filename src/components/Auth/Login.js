import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../../context/auth-context';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import {Link} from 'react-router-dom';
import SnackBar from '../Common/SnackBar';
import useStyles from './Auth.styles';
//TODO: Refactor Login and SignUp components to be one

const Login = (props) => {
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [messageState, setMessageState] = useState({
        message: '',
        messageStatus: '',
        displayMessage: false,
    });
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
                setMessageState({
                    displayMessage: true,
                    message: error.message,
                    messageStatus: 'error',
                });
                auth.login(false);
            })
            .finally(() => setLoading(false));
    };

    const handleMessageClose = () => {
        setMessageState({
            displayMessage: false,
            message: '',
            messageStatus: '',
        });
    };

    return( 
        <Container>
            {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
            <Typography variant="h3">Super Fun Retro</Typography>
            <Typography variant="subtitle1">Log In </Typography>
            <Typography variant="subtitle2">and start your Super Fun Retro experience!</Typography>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField className={classes.inputField} type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField className={classes.inputField}  type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" color="secondary" variant="contained" className={classes.submit}>Log In</Button>
            </form>
            <Link
                className={classes.links}   
                to="/forgotPassword">
                Forgot Your Password?
            </Link>
            <Link
                data-id="signup_from_login"
                className={classes.links}
                to={{
                    pathname: "/signup",
                    state: {retroId: retroId}
                }}
            > Sign Up </Link>
            {messageState.displayMessage 
                ? <SnackBar 
                    open={messageState.displayMessage} 
                    message={messageState.message} 
                    status={messageState.messageStatus} 
                    close={handleMessageClose}/> 
                : null }
        </Container>
    );
};

export default Login;