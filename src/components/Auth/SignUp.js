import React, { useState, useContext } from 'react'
import { useForm, Controller } from 'react-hook-form'
import PropTypes from 'prop-types'
import { authFirebase } from '../../firebase'
import AuthContext from '../../context/auth-context'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Typography from '@material-ui/core/Typography/Typography'
import { Link } from 'react-router-dom'
import SnackBar from '../Common/SnackBar'
import useStyles from './Auth.styles'

const SignUp = props => {
  const { handleSubmit, control, errors, watch } = useForm()
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const [isLoading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const classes = useStyles()

  let retroId = null
  if (props.location && props.location.state) {
    retroId = props.location.state.retroId
  }

  const submitHandler = data => {
    setLoading(true)
    authFirebase
      .createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        setLoading(false)
        auth.login(true)
        retroId ? props.history.push('/retro/' + retroId) : props.history.push('/retroList')
      })
      .catch(function(error) {
        setLoading(false)
        setMessageState({
          displayMessage: true,
          message: error.message,
          messageStatus: 'error',
        })
        auth.login(false)
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
      <Typography variant="subtitle1">Sign Up </Typography>
      <Typography variant="subtitle2">Start making your sprint retrospectives super fun!</Typography>
      <form className={classes.form} onSubmit={handleSubmit(submitHandler)}>
        <Controller
          name="email"
          control={control}
          defaultValue={''}
          rules={{
            required: 'You must provide a valid email address',
          }}
          as={
            <TextField
              data-testid="signup_email"
              className={classes.inputField}
              type="email"
              placeholder="Email"
              helperText={errors.email && errors.email.message}
              error={errors.email}
            />
          }
        />
        <Controller
          name="password"
          control={control}
          defaultValue={''}
          rules={{
            required: 'You must specify a password',
            minLength: {
              value: 8,
              message: 'Password must have at least 8 characters',
            },
          }}
          as={
            <TextField
              data-testid="signup_password"
              className={classes.inputField}
              type="password"
              placeholder="Password"
              helperText={errors.password && errors.password.message}
              error={errors.password}
            />
          }
        />
        <Controller
          control={control}
          name="confirmPassword"
          defaultValue={''}
          rules={{
            required: 'You must confirm your password',
            validate: value => value === watch('password') || 'Passwords do not match',
          }}
          as={
            <TextField
              data-testid="signup_confirm-password"
              className={classes.inputField}
              type="password"
              placeholder="Confirm Password"
              helperText={errors.confirmPassword && errors.confirmPassword.message}
              error={errors.confirmPassword}
            />
          }
        />
        <Button
          data-testid="signup_submit"
          type="submit"
          value="Sign Up"
          color="secondary"
          variant="contained"
          className={classes.submit}
        >
          Sign Up
        </Button>
      </form>
      <Link
        to={{
          pathname: '/login',
          state: { retroId: retroId },
        }}
      >
        Log In
      </Link>
      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          close={handleMessageClose}
        />
      ) : null}
    </Container>
  )
}

SignUp.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
}

export default SignUp
