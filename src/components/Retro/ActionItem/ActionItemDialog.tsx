import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ManageTeamsType } from '../../../constants/types.constant'

interface DialogPropTypes {
  showActionItemDialog: boolean
  previousRetro: string
  handleActionItemDialogClose: () => {}
  createActionItem: (item: any) => {}
  team: ManageTeamsType[]
}
const ActionItemDialog: React.FC<DialogPropTypes> = (props): JSX.Element => {
  const { showActionItemDialog, handleActionItemDialogClose, createActionItem, team } = props
  const [teamValue, setTeamValue] = useState<ManageTeamsType[]>([])
  const [itemValue, setItemValue] = useState('')
  const handleCreateActionItem = () => {
    createActionItem({
      value: itemValue,
      team: teamValue.length > 0 ? teamValue : [],
    })
    setItemValue('')
  }
  return (
    <Dialog data-testid="actionitem_dialog" open={showActionItemDialog} onClose={handleActionItemDialogClose}>
      <DialogTitle>
        <Typography>Create Action Item</Typography>
        <IconButton onClick={handleActionItemDialogClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          multiline
          rows="3"
          type="text"
          label="Start Typing"
          value={itemValue}
          onChange={e => setItemValue(e.target.value)}
        />
        <Autocomplete
          multiple
          filterSelectedOptions
          value={teamValue}
          defaultValue={[]}
          options={team}
          onChange={(e, option) => setTeamValue(option)}
          getOptionLabel={(option: ManageTeamsType) => option.teamName}
          getOptionSelected={(option, value) => option.teamName === value.teamName}
          renderInput={params => <TextField {...params} label="Team(s)" />}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleCreateActionItem}>
          Create Action Item
        </Button>
        <Button color="secondary" variant="outlined" onClick={handleActionItemDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionItemDialog
