import React, { useState } from 'react'
import { authFirebase } from '../../firebase'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography/Typography'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import { Link } from 'react-router-dom'
import SnackBar from '../Common/SnackBar'
import useStyles from './Auth.styles'

const ForgotPassword: React.FC = ():JSX.Element => {
  const [emailAddress, setEmailAddress] = useState('')
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const [isLoading, setLoading] = useState(false)
  const classes = useStyles()

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    authFirebase
      .sendPasswordResetEmail(emailAddress)
      .then(function() {
        setMessageState({
          displayMessage: true,
          message: `An email has been sent to ${emailAddress}.`,
          messageStatus: 'success',
        })
      })
      .catch(function(error) {
        setMessageState({
          displayMessage: true,
          message: error.message,
          messageStatus: 'error',
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }

  return (
    <Container>
      {isLoading ? <LinearProgress /> : <div className={classes.placeHolder}></div>}
      <Typography variant="h3">Super Fun Retro</Typography>
      <Typography variant="subtitle1">Reset Your Password</Typography>
      <Typography variant="subtitle2">Enter the email associated with your Super Fun Retro account</Typography>
      <form onSubmit={submitHandler.bind(this)}>
        <TextField
          className={classes.inputField}
          type="email"
          placeholder="Email"
          value={emailAddress}
          onChange={event => setEmailAddress(event.target.value)}
        />
        <Button type="submit" value="Reset Password" color="secondary" variant="contained" className={classes.submit}>
          Reset Password
        </Button>
      </form>
      <Link className={classes.links} to="/signup">
        {' '}
        Sign Up{' '}
      </Link>
      <Link className={classes.links} to="/login">
        Log In
      </Link>
      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          onClose={handleMessageClose}
        />
      ) : null}
    </Container>
  )
}

export default ForgotPassword
