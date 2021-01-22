import * as React from 'react'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import DialogComponent from '../../Common/DialogComponent'
import { Button, FormControl, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
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
  const [emailList, setEmailList] = useState<string[]>([])
  const [error, setError] = useState(false)
  const classes = useStyles()
  useEffect(() => {
    setTeamName(editTeam?.teamName)
    setEmailList(editTeam?.emailList)
  }, [editTeam])
  const onSubmitHandler = () => {
    const newTeam = {
      ...editTeam,
      teamName: teamName,
    }
    handleEditClose()
    handleEditSubmit(newTeam)
  }
  const validateEmail = (email: string) => {
    if (!email) {
      setError(false)
      return
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test(String(email).toLowerCase())) {
      setError(false)
    } else {
      setError(true)
    }
  }

  const ErrorTypography = withStyles(theme => ({
    root: {
      color: theme.palette.error.dark,
    },
  }))(Typography)

  return (
    <DialogComponent
      open={editStatus}
      onClose={handleEditClose}
      title={`Edit Team - ${editTeam?.teamName}`}
      actions={[
        <Button disabled={error} key={0} type="submit" color="secondary" variant="contained" onClick={onSubmitHandler}>
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
      <Autocomplete
        id="email"
        multiple
        freeSolo
        filterSelectedOptions
        className={`${classes.inputField} ${classes.inputFieldText}`}
        options={emailList}
        value={emailList}
        onChange={(e, option) => setEmailList(option)}
        onInputChange={(e, value) => validateEmail(value)}
        renderInput={params => <TextField error={error} {...params} label="Email(s)" />}
        size="small"
      />
      {error ? <ErrorTypography variant="caption">Please enter a valid email</ErrorTypography> : null}
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
