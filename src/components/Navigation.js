import React, { useContext } from 'react'
import AuthContext from '../context/auth-context'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { authFirebase } from '../firebase'
import Typography from '@material-ui/core/Typography/Typography'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    color: '#fff',
  },
  header: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    margin: '0 0 0 auto',
  },
  faq: {
    color: 'white',
    textDecoration: 'none',
  },
}))
const Navigation = () => {
  const auth = useContext(AuthContext)
  const handleLogOut = () => {
    authFirebase
      .signOut()
      .then(function() {
        auth.login(false)
      })
      .catch(function(error) {
        console.log('error: ', error)
      })
  }
  const classes = useStyles()
  const authenticatedNav = (
    <div className={classes.buttonContainer}>
      <Link to="/manageActionItems" style={{ textDecoration: 'none' }}>
        <Button style={{color: 'white'}} className={classes.button}>Manage Action Items</Button>
      </Link>
      <Link to="/manageTeams" style={{ textDecoration: 'none' }}>
        <Button style={{color: 'white'}} className={classes.button}>Manage Teams</Button>
      </Link>
      <Link to="/retroList" style={{ textDecoration: 'none' }}>
        <Button style={{color: 'white'}} className={classes.button}>Manage Retros</Button>
      </Link>
      <Link data-testid="sign_out" to="/login" style={{ textDecoration: 'none' }} onClick={handleLogOut.bind(this)}>
        <Button style={{color: 'white'}} className={classes.button}>Log Out</Button>
      </Link>
    </div>
  )
  return (
    <AppBar position="static" style={{ padding: '0px,0px,0px,0px', margin: '0 0 10px 0' }}>
      <Toolbar>
        <Typography className={classes.header}>Super Fun Retro</Typography>
        {auth.userId ? authenticatedNav : null}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
