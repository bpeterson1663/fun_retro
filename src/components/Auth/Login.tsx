import React, { useState, useContext } from 'react'
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
//TODO: Refactor Login and SignUp components to be one
interface LoginT {
  location: {
    state?: {
      retroId?: string
    }
  }
  history: string[]
  match: {
    params?: {
      id?: string
    }
  }
}
const Login: React.FC<LoginT> = (props): JSX.Element => {
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const [isLoading, setLoading] = useState(false)
  const auth = useContext(AuthContext)
  const classes = useStyles()

  let retroId = ''
  if (props?.location?.state?.retroId) {
    retroId = props.location.state.retroId
  }
  if (props?.match?.params?.id) {
    retroId = props.match.params.id
  }

  const submitHandler = (event: React.FormEvent) => {
    setLoading(true)
    event.preventDefault()
    authFirebase
      .signInWithEmailAndPassword(emailValue, passwordValue)
      .then(res => {
        setLoading(false)
        if (res.user) {
          auth.login(res.user.uid)
        } else {
          auth.login('')
        }
        retroId ? props.history.push('/retro/' + retroId) : props.history.push('/retroList')
      })
      .catch(error => {
        setLoading(false)
        setMessageState({
          displayMessage: true,
          message: error.message,
          messageStatus: 'error',
        })
        auth.login('')
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
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
      <Typography variant="h3">Super Fun Retro</Typography>
      <Typography variant="subtitle1">Log In </Typography>
      <Typography variant="subtitle2">and start your Super Fun Retro experience!</Typography>
      <form className={classes.form} onSubmit={submitHandler.bind(this)}>
        <TextField
          className={classes.inputField}
          type="email"
          placeholder="Email"
          value={emailValue}
          onChange={event => setEmailValue(event.target.value)}
        />
        <TextField
          className={classes.inputField}
          type="password"
          placeholder="Password"
          value={passwordValue}
          onChange={event => setPasswordValue(event.target.value)}
        />
        <Button type="submit" color="secondary" variant="contained" className={classes.submit}>
          Log In
        </Button>
      </form>
      <Link className={classes.links} to="/forgotPassword">
        Forgot Your Password?
      </Link>
      <Link
        data-testid="signup_from_login"
        className={classes.links}
        to={{
          pathname: '/signup',
          state: { retroId: retroId },
        }}
      >
        {' '}
        Sign Up{' '}
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

Login.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.array.isRequired,
}
export default Login
