import * as React from 'react'
import { useEffect, useState, useContext } from 'react'
import { db } from '../../firebase'
import dayjs from 'dayjs'
import useStyles from './AdminContainer.styles'
import Container from '@material-ui/core/Container'
import { useForm, NestedValue, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import { columnTitles } from '../../constants/columns.constants'
import MenuItem from '@material-ui/core/MenuItem'
import AuthContext from '../../context/auth-context'
import Typography from '@material-ui/core/Typography/Typography'
import FormControl from '@material-ui/core/FormControl'
import Tooltip from '@material-ui/core/Tooltip'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import HelpIcon from '@material-ui/icons/Help'
import { ManageTeamsType, RetroType } from '../../constants/types.constants'
import Button from '@material-ui/core/Button'
import SnackBar from '../Common/SnackBar'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import { useParams, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import emailjs from 'emailjs-com'
import SERVICE_ID, { EDIT_RETRO_TEMPLATE } from '../../constants/emailjs.constants'

interface ParamTypes {
  id: string
}

interface RetroForm {
  name: string
  columnsKey: string
  team: NestedValue<ManageTeamsType[]>
  startDate: string
  endDate: string
  numberOfVotes: number
}
const EditRetro: React.FC = (): JSX.Element => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [editRetro, setEditRetro] = useState<RetroType>()
  const [allTeams, setTeams] = useState<ManageTeamsType[]>([])
  const [teamValue, setTeamValue] = useState<ManageTeamsType[]>([])
  const { id } = useParams<ParamTypes>()

  const { handleSubmit, setValue, control } = useForm<RetroForm>()
  const classes = useStyles()
  const [response, setResponse] = useState({ open: false, status: '', message: '' })

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        db
          .collection('retros')
          .doc(id)
          .get(),
        db
          .collection('teams')
          .where('userId', '==', auth.userId)
          .get(),
      ])
        .then(res => {
          const [retroSnapshot, allSnapshot] = res
          const retroData = retroSnapshot.data()
          if (!retroData) {
            history.push('/retroList')
          } else {
            const teams: ManageTeamsType[] = []
            const retro = {
              ...retroData,
              team: retroData.team ? retroData.team : [],
            } as RetroType

            allSnapshot.docs.forEach(doc => {
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
            setEditRetro(retro)
            setTeamValue(retroData.team ? retroData.team : [])
            setValue('name', retroData?.name)
            setValue('columnsKey', retroData?.columnsKey)
            setValue('endDate', retroData?.endDate)
            setValue('startDate', retroData?.startDate)
            setValue('numberOfVotes', retroData?.numberOfVotes)
          }
        })
        .catch(() => history.push('/retroList'))
    }
    fetchData()
  }, [auth.userId, history, id, setValue])
  const onSubmitHandler = (data: RetroForm) => {
    const retro = {
      ...editRetro,
      ...data,
      team: teamValue ? teamValue : [],
    }
    db.collection('retros')
      .doc(id)
      .update(retro)
      .then(() => {
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'success',
          message: 'Oh yea! Way to make those changes!',
        })
      })
  }

  const sendEmail = () => {
    setIsLoading(true)
    const emailTasks: { id: string; retro_name?: string; email: string }[] = []
    teamValue.forEach(team => {
      team.emailList.forEach(email => {
        const templateParams = {
          id: id,
          retro_name: editRetro?.name,
          email: email.email,
          team: team.teamName,
        }
        emailTasks.push(templateParams)
      })
    })
    const promises = emailTasks.map(task => emailjs.send(SERVICE_ID, EDIT_RETRO_TEMPLATE, task))
    Promise.all(promises)
      .then(() => {
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'success',
          message: 'Boom! An email has been sent to each member of the team(s)!',
        })
      })
      .catch(() => {
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'error',
          message: 'Oh no! Something went wrong with sending the emails',
        })
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
      <Typography variant="h5">Edit Retro</Typography>
      <a rel="noopener noreferrer" target="_blank" href={'https://superfunretro.herokuapp.com/retro/' + id}>
        https://superfunretro.herokuapp.com/retro/{id}
      </a>
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
            defaultValue=""
            as={
              <Select
                data-testid="retro_type"
                required
                disabled
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
            value={teamValue}
            defaultValue={[]}
            multiple
            filterSelectedOptions
            className={`${classes.inputField} ${classes.inputFieldText}`}
            options={allTeams}
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
          <Button className={classes.actionButton} type="submit" color="secondary" variant="contained">
            Save Retro
          </Button>
          {teamValue.length > 0 ? (
            <Button
              disabled={isLoading}
              className={classes.actionButton}
              color="secondary"
              variant="contained"
              onClick={sendEmail}
            >
              Send Email Update
            </Button>
          ) : null}
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

export default EditRetro
