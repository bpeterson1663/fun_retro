import * as React from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import { Button } from '@material-ui/core'
import { ManageTeamsType } from '../../../constants/types.constants'
import ManageTeamsForm from '../ManageTeams/ManageTeamsForm'

type EditTeamT = {
  editTeam: ManageTeamsType
  handleEditClose: () => void
  editStatus: boolean
  handleEditSubmit: (team: ManageTeamsType) => void
}
const EditTeamDialog: React.FC<EditTeamT> = (props): JSX.Element => {
  const { editTeam, handleEditClose, editStatus, handleEditSubmit } = props

  const onSubmitHandler = (data: ManageTeamsType) => {
    handleEditSubmit(data)
    handleEditClose()
  }

  return (
    <DialogComponent
      open={editStatus}
      onClose={handleEditClose}
      title={`Edit Team - ${editTeam?.teamName}`}
      actions={[
        <Button key={0} color="secondary" variant="outlined" onClick={handleEditClose}>
          Cancel
        </Button>,
      ]}
    >
      <ManageTeamsForm editData={editTeam} handleSubmit={onSubmitHandler} />
      
    </DialogComponent>
  )
}
EditTeamDialog.propTypes = {
  editTeam: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    userId: PropTypes.string.isRequired,
    emailList: PropTypes.array.isRequired,
  }).isRequired,
  handleEditClose: PropTypes.func.isRequired,
  editStatus: PropTypes.bool.isRequired,
  handleEditSubmit: PropTypes.func.isRequired,
}
export default EditTeamDialog
