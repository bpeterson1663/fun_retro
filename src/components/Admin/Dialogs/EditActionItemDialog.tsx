import * as React from 'react'
import { useState, useEffect } from 'react'
import useStyles from '../AdminContainer.styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ManageTeamsType, ActionItemType } from '../../../constants/types.constant'

interface EditActionT {
  item: ActionItemType
  editStatus: boolean
  teams: ManageTeamsType[]
  editActionItem: (item: { value: string; teamId: string }) => void
  handleEditActionClose: () => void
}
const EditActionItemDialog: React.FC<EditActionT> = (props): JSX.Element => {
  const { editStatus, handleEditActionClose, teams, editActionItem, item } = props
  const [itemValue, setItemValue] = useState('')
  const [teamValue, setTeamValue] = useState<ManageTeamsType | null>({} as ManageTeamsType)
  const classes = useStyles()
  const handleEditActionItem = () => {
    if (!itemValue) return
    editActionItem({
      value: itemValue,
      teamId: teamValue ? teamValue.id : '',
    })
  }
  useEffect(() => {
    setItemValue(item.value)
    const teamState = teams.find(team => team.id === item.teamId)
    setTeamValue(teamState ? teamState : null)
  }, [])
  return (
    <Dialog open={editStatus} onClose={handleEditActionClose}>
      <DialogTitle>
        <Typography>Edit Action Item</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          className={`${classes.inputField} ${classes.inputFieldText}`}
          variant="outlined"
          multiline
          required
          rows="3"
          type="text"
          label="Start Typing"
          value={itemValue}
          onChange={e => setItemValue(e.target.value)}
        />
        <Autocomplete
          filterSelectedOptions
          value={teamValue}
          options={teams}
          onChange={(e, option) => setTeamValue(option)}
          getOptionLabel={(option: ManageTeamsType) => option.teamName}
          getOptionSelected={(option, value) => option.teamName === value.teamName}
          renderInput={params => <TextField {...params} label="Team" />}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleEditActionItem}>
          Edit Action Item
        </Button>
        <Button color="secondary" variant="outlined" onClick={handleEditActionClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditActionItemDialog
