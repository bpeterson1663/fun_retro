import * as React from 'react'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import { Button, FormControl, TextField } from '@material-ui/core'
import { ManageTeamsType } from '../../../constants/types.constant'
import useStyles from '../AdminContainer.styles'

type EditTeamT = {
  editTeam: ManageTeamsType
  handleEditClose: () => void
  editStatus: boolean
  handleEditSubmit: (team: ManageTeamsType) => void
}
const EditTeamDialog: React.FC<EditTeamT> = (props): JSX.Element => {
  const { editTeam, handleEditClose, editStatus, handleEditSubmit } = props
  const [teamName, setTeamName] = useState('')
  const classes = useStyles()
  useEffect(() => {
    setTeamName(editTeam?.teamName)
  }, [editTeam])
  const onSubmitHandler = () => {
    const newTeam = {
      ...editTeam,
      teamName: teamName,
    }
    handleEditClose()
    handleEditSubmit(newTeam)
  }
  return (
    <DialogComponent
      open={editStatus}
      onClose={handleEditClose}
      title={`Edit Team - ${editTeam?.teamName}`}
      actions={[
        <Button key={0} type="submit" color="secondary" variant="contained" onClick={onSubmitHandler}>
          Edit
        </Button>,
        <Button key={1} color="secondary" variant="outlined" onClick={handleEditClose}>
          Cancel
        </Button>,
      ]}
    >
      <FormControl>
        <TextField
          value={teamName}
          className={`${classes.inputField} ${classes.inputFieldText}`}
          name="teamName"
          required
          onChange={event => setTeamName(event.target.value)}
          type="text"
          label="Team Name"
        />
      </FormControl>
    </DialogComponent>
  )
}
EditTeamDialog.propTypes = {
  editTeam: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  handleEditClose: PropTypes.func.isRequired,
  editStatus: PropTypes.bool.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
}
export default EditTeamDialog
