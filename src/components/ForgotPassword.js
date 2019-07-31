import React, {useState} from 'react';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CloseIcon from '@material-ui/icons/Close';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';
import Typography from '@material-ui/core/Typography/Typography';
import { green } from '@material-ui/core/colors';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import {Link} from 'react-router-dom';

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
    success: {
        backgroundColor: green[600]    
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    links: {
        margin: 10
    }
}));
const ForgotPassword = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [ messageStatus, setMessageStatus] = useState('');
    const [isLoading, setLoading] = useState(false);

    const classes = useStyles();
    const auth = firebase.auth();
    const submitHandler = (event) => {
        event.preventDefault();
        setLoading(true);
        auth.sendPasswordResetEmail(emailAddress).then(function() {
            setMessageStatus('success')
            setMessage(`An email has been sent to ${emailAddress}.`)
            setOpen(true);
        })
        .catch(function(error) {
        // An error happened.
            console.log('error: ', error);
            setMessageStatus('error')
            setMessage(error.message);
            setOpen(true)
        })
        .finally(() => {
            setLoading(false);
        });
    };
    const handleMessageClose = () => {
        setOpen(false);
        setMessage('');
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
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                autoHideDuration={6000}
                onClose={handleMessageClose}
            >
                <SnackbarContent
                    onClose={handleMessageClose}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                        <CheckCircleIcon />
                        {message}
                        </span>
                    }
                    className={classes[messageStatus]}
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

export default ForgotPassword;