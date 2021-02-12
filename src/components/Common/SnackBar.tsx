import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SnackbarContent from '@material-ui/core/SnackbarContent/SnackbarContent'
import useStyles from './Common.styles'

interface SnackBarT {
  open: boolean
  onClose: () => void
  message: string
  status: string
}
const SnackBar: React.FC<SnackBarT> = (props): JSX.Element => {
  const classes = useStyles()
  return (
    <Snackbar
      data-testid="snackbar_message"
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={props.open}
      autoHideDuration={6000}
      onClose={props.onClose}
    >
      <SnackbarContent
        data-testid="snackbar_content"
        aria-describedby="client-snackbar"
        message={
          <span id="client-snackbar" className={classes.message}>
            {props.message}
          </span>
        }
        className={props.status === 'error' ? classes.error : classes.success}
        action={[
          <IconButton key="close" aria-label="Close" color="inherit" onClick={props.onClose}>
            <CloseIcon />
          </IconButton>,
        ]}
      />
    </Snackbar>
  )
}

SnackBar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
}

export default SnackBar
