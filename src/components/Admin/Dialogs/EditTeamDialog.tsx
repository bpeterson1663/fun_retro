import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormControl,
  TextField,
} from '@material-ui/core'
import { ManageTeamsType } from '../../../constants/types.constant'
import useStyles from '../AdminContainer.styles'

type EditTeamT = {
  editTeam: ManageTeamsType | null
  handleEditClose: () => void
  editStatus: boolean
  handleEditSubmit: (team: ManageTeamsType) => void
}
const EditTeamDialog: React.FC<EditTeamT> = (props): JSX.Element => {
  const { editTeam, handleEditClose, editStatus, handleEditSubmit } = props
  const { handleSubmit, control } = useForm<ManageTeamsType>()
  const classes = useStyles()
  const onSubmitHandler = (data: ManageTeamsType) => {
    const newTeam = {
      ...editTeam,
      ...data,
    }
    handleEditClose()
    handleEditSubmit(newTeam)
  }
  return (
    <Dialog open={editStatus} onClose={handleEditClose}>
      <DialogTitle>
        <Typography>Edit Team - {editTeam?.teamName}</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form}>
          <FormControl>
            <Controller
              name="teamName"
              control={control}
              defaultValue={editTeam?.teamName}
              as={
                <TextField
                  className={`${classes.inputField} ${classes.inputFieldText}`}
                  name="teamName"
                  required
                  type="text"
                  label="Team Name"
                />
              }
            />
          </FormControl>

          <Button type="submit" color="secondary" variant="contained">
            Submit Edit
          </Button>
        </form>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  )
}

export default EditTeamDialog
