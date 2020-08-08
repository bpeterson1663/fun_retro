import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'

const ActionItemDialog = props => {
  const { showActionItemDialog, handleActionItemDialogClose, createActionItem } = props
  const classes = useStyles()
  const [itemValue, setItemValue] = useState('')

  const handleCreateActionItem = () => {
    createActionItem(itemValue)
    setItemValue('')
  }
  return (
    <Dialog data-testid="actionitem_dialog" open={showActionItemDialog} onClose={handleActionItemDialogClose}>
      <DialogTitle>
        <Typography>Create Action Item</Typography>
        <IconButton className={classes.closeButton} onClick={handleActionItemDialogClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          multiline
          rows="3"
          maxLength="1000"
          className={`${classes.inputField} ${classes.inputFieldText}`}
          type="text"
          label="Start Typing"
          value={itemValue}
          onChange={e => setItemValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleCreateActionItem}>
          Create Action Item
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ActionItemDialog.propTypes = {
  showActionItemDialog: PropTypes.bool,
  handleActionItemDialogClose: PropTypes.func,
  createActionItem: PropTypes.func,
}
export default ActionItemDialog
