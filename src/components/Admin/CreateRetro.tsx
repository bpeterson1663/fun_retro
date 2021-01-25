import * as React from 'react'
import { useContext, useState, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import dayjs from 'dayjs'
import useStyles from './AdminContainer.styles'
import { useForm, NestedValue, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { columnTitles } from '../../constants/columns.constants'
import MenuItem from '@material-ui/core/MenuItem'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import Typography from '@material-ui/core/Typography/Typography'
import FormControl from '@material-ui/core/FormControl'
import Tooltip from '@material-ui/core/Tooltip'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import HelpIcon from '@material-ui/icons/Help'
import { ManageTeamsType } from '../../constants/types.constants'
import Button from '@material-ui/core/Button'
import SnackBar from '../Common/SnackBar'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import { Link } from 'react-router-dom'
import emailjs from 'emailjs-com'
import SERVICE_ID, { CREATE_RETRO_TEMPLATE } from '../../constants/emailjs.constants'

interface RetroForm {
  name: string
  columnsKey: string
  team: NestedValue<ManageTeamsType[]>
  startDate: string
  endDate: string
  numberOfVotes: number
}
const CreateRetro: React.FC = (): JSX.Element => {
  const classes = useStyles()
  const auth = useContext(AuthContext)
  const [response, setResponse] = useState({ open: false, status: '', message: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [allTeams, setTeams] = useState<ManageTeamsType[]>([])
  const [teamValue, setTeamValue] = useState<ManageTeamsType[]>([])
  const { handleSubmit, register, reset, control } = useForm<RetroForm>({
    defaultValues: {
      columnsKey: columnTitles[0].value,
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      numberOfVotes: 6,
    },
  })

  useEffect(() => {
    register('team')

    db.collection('teams')
      .where('userId', '==', auth.userId)
      .get()
      .then(querySnapshot => {
        const teams: ManageTeamsType[] = []
        querySnapshot.docs.forEach(doc => {
          const data = doc.data()
          teams.push({
            id: doc.id,
            teamName: data.teamName,
            timestamp: data.timestamp,
            userId: data.userId,
            emailList: data.emailList ? data.emailList : [],
          })
        })

        setTeams(teams)
      })
  }, [auth.userId, register])
  const onSubmitHandler = (data: RetroForm) => {
    setIsLoading(true)
    db.collection('retros')
      .add({
        ...data,
        team: teamValue ? teamValue : [],
        isActive: true,
        timestamp: dayjs().valueOf(),
        userId: auth.userId,
      })
      .then(res => {
        reset({
          name: '',
          numberOfVotes: 6,
          startDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().format('YYYY-MM-DD'),
          columnsKey: columnTitles[0].value,
        })
        const emailTasks: { id: string; retro_name: string; email: string }[] = []
        teamValue.forEach(team => {
          team.emailList.forEach(email => {
            const templateParams = {
              id: res.id,
              retro_name: data.name,
              email: email.email,
              team: team.teamName
            }
            emailTasks.push(templateParams)
          })
        })
        const promises = emailTasks.map(task => emailjs.send(SERVICE_ID, CREATE_RETRO_TEMPLATE, task))
        Promise.all(promises)
          .then(res => {
            setIsLoading(false)
            console.log(res)
          })
          .catch(error => console.error('error: ', error))

        setTeamValue([])
        setResponse({
          open: true,
          status: 'success',
          message: 'Retro was created successfully!',
        })
      })
      .catch(err => {
        setIsLoading(false)
        console.error(err)
      })
  }

  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <div className={classes.actionButtons}>
        <Link to="/retroList" style={{ textDecoration: 'none' }}>
          <Button size="small" color="secondary" variant="contained">
            Back to Manage Retros
          </Button>
        </Link>
      </div>
      <Typography variant="h5">Create Retro</Typography>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form}>
        <FormControl>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            as={
              <TextField
                inputProps={{ 'data-testid': 'retro_name' }}
                name="name"
                required
                className={`${classes.inputField} ${classes.inputFieldText}`}
                type="text"
                label="Retro Name"
              />
            }
          />
        </FormControl>
        <FormControl>
          <InputLabel required className={classes.inputLabel} id="retro-type">
            Retro Type
          </InputLabel>
          <Controller
            name="columnsKey"
            control={control}
            as={
              <Select
                data-testid="retro_type"
                required
                labelId="retro-type"
                id="retro-type-select"
                className={`${classes.inputField} ${classes.inputFieldText}`}
              >
                {columnTitles.map((columnsType, i) => {
                  return (
                    <MenuItem key={i} data-testid={`retro_type-${columnsType.value}`} value={columnsType.value}>
                      {columnsType.title}
                    </MenuItem>
                  )
                })}
              </Select>
            }
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <Autocomplete
            id="team"
            multiple
            filterSelectedOptions
            className={`${classes.inputField} ${classes.inputFieldText}`}
            options={allTeams}
            value={teamValue}
            onChange={(e, option) => setTeamValue(option)}
            getOptionLabel={(option: ManageTeamsType) => option.teamName}
            getOptionSelected={(option, value) => option.teamName === value.teamName}
            renderInput={params => <TextField {...params} label="Team(s)" />}
          />

          <Tooltip
            title="Select the team(s) this retro will be for. When creating action items, they will be grouped by team"
            aria-label="add-team"
          >
            <HelpIcon fontSize="small" className={classes.helpIcon} />
          </Tooltip>
        </FormControl>
        <FormControl>
          <Controller
            name="startDate"
            control={control}
            defaultValue={dayjs().format('YYYY-MM-DD')}
            as={
              <TextField
                inputProps={{ 'data-testid': 'retro_start' }}
                className={classes.inputField}
                name="startDate"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                label="Start Date"
              />
            }
          />
        </FormControl>
        <FormControl>
          <Controller
            name="endDate"
            control={control}
            defaultValue={dayjs().format('YYYY-MM-DD')}
            as={
              <TextField
                inputProps={{ 'data-testid': 'retro_end' }}
                className={classes.inputField}
                name="endDate"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                label="Start Date"
              />
            }
          />
        </FormControl>
        <FormControl>
          <Controller
            name="numberOfVotes"
            control={control}
            defaultValue={6}
            as={
              <TextField
                inputProps={{ 'data-testid': 'retro_vote' }}
                name="retro_vote"
                required
                className={classes.inputField}
                type="number"
                label="Votes Per Person"
              />
            }
          />
        </FormControl>
        <div className={classes.actionButtons}>
          <Button type="submit" color="secondary" variant="contained">
            Create Retro
          </Button>
        </div>
      </form>
      <SnackBar
        open={response.open}
        message={response.message}
        status={response.status}
        onClose={() => setResponse({ open: false, message: '', status: '' })}
      />
    </Container>
  )
}

export default CreateRetro
