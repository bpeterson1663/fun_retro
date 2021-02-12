import * as React from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core/'
import useStyles from './Common.styles'

interface DialogComponentT {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  actions: React.ReactNode
  settings?: unknown
}

const DialogComponent: React.FC<DialogComponentT> = (props): JSX.Element => {
  const { open, onClose, title, children, actions, settings } = props
  const classes = useStyles()
  return (
    <Dialog data-testid="dialog_component" open={open} onClose={onClose} {...settings}>
      <DialogTitle>
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </Dialog>
  )
}
DialogComponent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  actions: PropTypes.node.isRequired,
  settings: PropTypes.object,
}
export default DialogComponent
