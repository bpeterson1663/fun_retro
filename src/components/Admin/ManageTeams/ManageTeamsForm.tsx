import * as React from 'react'
import PropTypes from 'prop-types'
import { useState, useContext, useEffect } from 'react'
import useStyles from '../AdminContainer.styles'
import { withStyles } from '@material-ui/core/styles'
import { Button, Chip, FormControl, Grid, TextField } from '@material-ui/core'
import Typography from '@material-ui/core/Typography/Typography'
import dayjs from 'dayjs'
import { ManageTeamsType, EmailData } from '../../../constants/types.constants'
import AuthContext from '../../../context/auth-context'

interface ManageTeamsFromT {
  handleSubmit: (data: ManageTeamsType) => void
  editData?: ManageTeamsType
}
const ManageTeamsForm: React.FC<ManageTeamsFromT> = ({ handleSubmit, editData }): JSX.Element => {
  const auth = useContext(AuthContext)
  const [error, setError] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [chipList, setChipList] = useState<EmailData[]>([])
  const [emailValue, setEmailValue] = useState('')
  const classes = useStyles()

  useEffect(() => {
    if (editData) {
      setTeamName(editData.teamName)
      setChipList(editData.emailList)
    }
  }, [editData])

  const handleSubmitForm = () => {
    let newTeam = {} as ManageTeamsType
    if (editData) {
      newTeam = {
        ...editData,
        teamName: teamName,
        emailList: chipList,
      }
    } else {
      newTeam = {
        teamName: teamName,
        emailList: chipList,
        timestamp: dayjs().valueOf(),
        userId: auth.userId,
      } as ManageTeamsType
    }
    handleSubmit(newTeam)
    setChipList([])
    setTeamName('')
    setEmailValue('')
  }

  const handleChipDelete = (chipToDelete: EmailData) => {
    const newState = [...chipList]
    setChipList(newState.filter(chip => chip.id !== chipToDelete.id))
  }

  const handleChipAdd = () => {
    const chipToAdd = {
      email: emailValue,
      id: dayjs().valueOf(),
    } as EmailData
    const newState = [...chipList]
    newState.push(chipToAdd)
    setEmailValue('')
    setChipList(newState)
  }

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isValidEmail = (text: string): boolean => {
    return re.test(String(text).toLowerCase())
  }

  const ErrorTypography = withStyles(theme => ({
    root: {
      color: theme.palette.error.dark,
      margin: '0 auto',
    },
  }))(Typography)

  const EmailList: React.FC = (): JSX.Element => {
    return (
      <>
        <Typography variant="subtitle1">List of Emails</Typography>
        <Grid component="ul" className={classes.chipList}>
          {chipList.map(data => (
            <li key={data.id}>
              <Chip label={data.email} onDelete={() => handleChipDelete(data)} />
            </li>
          ))}
        </Grid>
      </>
    )
  }

  return (
    <Grid className={classes.form}>
      <FormControl>
        <TextField
          className={`${classes.inputField} ${classes.inputFieldText}`}
          name="teamName"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          required
          type="text"
          label="Team Name"
        />
      </FormControl>
      <FormControl>
        <TextField
          className={`${classes.inputField} ${classes.inputFieldText}`}
          value={emailValue}
          label="Add an email"
          error={error}
          onChange={e => {
            setEmailValue(e.target.value)
            if (isValidEmail(e.target.value) || !e.target.value) {
              setError(false)
            } else {
              setError(true)
            }
          }}
        />
        {error ? (
          <ErrorTypography variant="caption" display="block">
            Please enter a valid email
          </ErrorTypography>
        ) : null}
        <div className={classes.actionButtons}>
          <Button
            color="secondary"
            variant="contained"
            size="small"
            disabled={error || !emailValue}
            onClick={handleChipAdd}
            className={classes.buttonSecondary}
          >
            Add Email
          </Button>
        </div>
        {chipList.length > 0 ? <EmailList /> : null}
      </FormControl>
      <div className={classes.actionButtons}>
        <Button
          type="submit"
          color="secondary"
          onClick={handleSubmitForm}
          disabled={(error && chipList.length < 1) || !teamName}
          variant="contained"
        >
          {editData ? 'Edit Team' : 'Create Team'}
        </Button>
      </div>
    </Grid>
  )
}

ManageTeamsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    teamName: PropTypes.string.isRequired,
    emailList: PropTypes.array.isRequired,
    timestamp: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }),
}

export default ManageTeamsForm
