import React, {useState} from 'react';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {Link} from 'react-router-dom';
import SnackBar from './SnackBar';

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
    },
    links: {
        margin: 10
    }
}));
const ForgotPassword = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [messageState, setMessageState] = useState({
        message: '',
        messageStatus: '',
        displayMessage: false,
    });
    const [isLoading, setLoading] = useState(false);
    const classes = useStyles();
    const auth = firebase.auth();

    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            setMessageState({
                displayMessage: true,
                message: `An email has been sent to ${emailAddress}.`,
                messageStatus: 'success',
            });
        })
        .catch(function(error) {
            setMessageState({
                displayMessage: true,
                message: error.message,
                messageStatus: 'error',
            });
        })
        .finally(() => {
            setLoading(false);
        });
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
            {isLoading ? <LinearProgress /> : <div className={classes.placeHolder}></div>}
            <Typography variant="h3">Super Fun Retro</Typography>
            <Typography variant="subtitle1">Reset Your Password</Typography>
            <Typography variant="subtitle2">Enter your email associated with your Super Fun Retro account</Typography>
            <form onSubmit={submitHandler.bind(this)}>
                <TextField className={classes.inputField} type="email" placeholder="Email" value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)}/>
                <Button type="submit" value="Reset Password" color="secondary" variant="contained" className={classes.submit}>Reset Password</Button>
            </form>
            <Link className={classes.links} to="/signup"> Sign Up </Link>
            <Link className={classes.links} to="/login">Log In</Link>
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

export default ForgotPassword;