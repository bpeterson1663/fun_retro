import React, {useState, useContext} from 'react';
import firebase from 'firebase';
import AuthContext from '../../context/auth-context';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import {Link} from 'react-router-dom';
import SnackBar from '../Common/SnackBar';
//TODO: Lots of useState references. Can this be combined into one?
const useStyles = makeStyles(theme => ({
    inputField: {
      margin: theme.spacing(2),
    },
    placeHolder: {
        height: 5
    },
    submit:{
        display: 'block',
        margin: '10px auto'
    }
}));
const SignUp = (props) => {
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

    const submitHandler = event => {
        setLoading(true);
        event.preventDefault();
        firebase.auth()
            .createUserWithEmailAndPassword(emailValue, passwordValue)
            .then((res) => {
                auth.login(true);
                retroId ?
                    props.history.push('/retro/'+retroId) :
                    props.history.push('/retroList');
            })
            .catch(function(error) {
                setMessageState({
                    displayMessage: true,
                    message: error.message,
                    messageStatus: 'error',
                });
                auth.login(false);

            })
            .finally(() => setLoading(false));
        
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

    const handleMessageClose = () => {
        setMessageState({
            displayMessage: false,
            message: '',
            messageStatus: '',
        });
    };

    return (
        <Container>
            {isLoading ? <LinearProgress /> : <div className={classes.placeHolder}></div>}
            <Typography variant="h3">Super Fun Retro</Typography>
            <Typography variant="subtitle1">Sign Up </Typography>
            <Typography variant="subtitle2">Start making your sprint retrospectives super fun!</Typography>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField className={classes.inputField} type="email" placeholder="Email" value={emailValue} onChange={(event) => onChangeHandler(event, 'email')}/>
                <TextField className={classes.inputField} type="password" placeholder="Password" value={passwordValue} onChange={(event) => onChangeHandler(event, 'password')}/>
                <Button type="submit" value="Sign Up" color="secondary" variant="contained" className={classes.submit}>Sign Up</Button>
            </form>
            <Link
                to={{
                    pathname: "/login",
                    state: {retroId: retroId}
                }}
            > Log In </Link>
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

export default SignUp;