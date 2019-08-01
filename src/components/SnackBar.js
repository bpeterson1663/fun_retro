import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { green } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent';

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
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: green[600]    
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    links: {
        margin: 10
    }
}));
const SnackBar = (props) => {
    const classes = useStyles();
    return (
        <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={props.open}
                autoHideDuration={6000}
                onClose={props.close}
            >
                <SnackbarContent
                    onClose={props.close}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                        {props.message}
                        </span>
                    }
                    className={classes[props.status]}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={props.close}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </Snackbar>
    );
};

export default SnackBar;