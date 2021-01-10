import * as React from 'react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import useStyles from '../AdminContainer.styles'
import DialogComponent from '../../Common/DialogComponent'
import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ManageTeamsType, ActionItemType } from '../../../constants/types.constant'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

interface EditActionT {
  item: ActionItemType
  editStatus: boolean
  teams: ManageTeamsType[]
  editActionItem: (item: {
    value: string
    teamId: string
    owner: string
    completed: boolean
    completedDate: string
  }) => void
  handleEditActionClose: () => void
}
const EditActionItemDialog: React.FC<EditActionT> = (props): JSX.Element => {
  const { editStatus, handleEditActionClose, teams, editActionItem, item } = props
  const [itemValue, setItemValue] = useState('')
  const [ownerValue, setOwnerValue] = useState('')
  const [teamValue, setTeamValue] = useState<ManageTeamsType | null>({} as ManageTeamsType)
  const [completedValue, setCompletedValue] = useState(false)
  const [completedDateValue, setCompletedDateValue] = useState('')
  const classes = useStyles()
  const handleEditActionItem = () => {
    if (!itemValue) return
    editActionItem({
      value: itemValue,
      teamId: teamValue ? teamValue.id : '',
      owner: ownerValue ? ownerValue : '',
      completed: completedValue,
      completedDate: completedDateValue,
    })
  }
  useEffect(() => {
    setItemValue(item.value)
    const teamState = teams.find(team => team.id === item.teamId)
    setTeamValue(teamState ? teamState : null)
    setOwnerValue(item.owner)
    setCompletedValue(typeof item.completed === 'boolean' ? item.completed : false)
    setCompletedDateValue(item.completedDate ? item.completedDate : '')
  }, [teams, item])

  const handleCompletedChange = () => {
    const newState = !completedValue
    setCompletedValue(newState)
    setCompletedDateValue(newState ? dayjs().format('L') : '')
  }

  return (
    <DialogComponent
      open={editStatus}
      onClose={handleEditActionClose}
      title="Edit Action Item"
      actions={[
        <Button key={0} color="secondary" variant="contained" onClick={handleEditActionItem}>
          Edit Action Item
        </Button>,
        <Button key={1} color="secondary" variant="outlined" onClick={handleEditActionClose}>
          Cancel
        </Button>,
      ]}
    >
      <FormControlLabel
        className={classes.checkbox}
        control={<Checkbox checked={completedValue} onChange={handleCompletedChange} name="completed" />}
        label="Completed"
      />
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
      <TextField
        className={`${classes.inputField} ${classes.inputFieldText}`}
        value={ownerValue}
        type="text"
        variant="outlined"
        label="Owner"
        onChange={e => setOwnerValue(e.target.value)}
      />
      <Autocomplete
        className={`${classes.inputField} ${classes.inputFieldText}`}
        filterSelectedOptions
        value={teamValue}
        options={teams}
        onChange={(e, option) => setTeamValue(option)}
        getOptionLabel={(option: ManageTeamsType) => option.teamName}
        getOptionSelected={(option, value) => option.teamName === value.teamName}
        renderInput={params => <TextField {...params} label="Team" />}
      />
    </DialogComponent>
  )
}

EditActionItemDialog.propTypes = {
  editStatus: PropTypes.bool.isRequired,
  handleEditActionClose: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  editActionItem: PropTypes.func.isRequired,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    retroId: PropTypes.string.isRequired,
    teamId: PropTypes.string.isRequired,
    retroName: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
    completedDate: PropTypes.string.isRequired,
  }).isRequired,
}
export default EditActionItemDialog
