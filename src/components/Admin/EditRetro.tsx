import * as React from 'react'
import { useEffect, useState, useContext } from 'react'
import { db } from '../../firebase'
import moment from 'moment'
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
import { PreviousRetroType } from '../../constants/types.constant'
import Button from '@material-ui/core/Button'
import SnackBar from '../Common/SnackBar'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import { useParams, useHistory } from 'react-router-dom'
interface ParamTypes {
  id: 'string'
}

interface RetroForm {
  name: string
  columnsKey: string
  previousRetro: NestedValue<PreviousRetroType[]>
  startDate: string
  endDate: string
  numberOfVotes: number
}
const EditRetro: React.FC = (): JSX.Element => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false)
  const [currentRetros, setCurrentRetros] = useState<PreviousRetroType[]>([])
  const [previousRetroValue, setPreviousRetro] = useState<PreviousRetroType | null>(null)
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
          .collection('retros')
          .where('userId', '==', auth.userId)
          .get(),
      ])
        .then(res => {
          const [retroSnapshot, allSnapshot] = res
          const retroData = retroSnapshot.data()
          if (!retroData) {
            history.push('/retroList')
          } else {
            const retros: PreviousRetroType[] = []
            allSnapshot.docs.forEach(doc => {
              const data = doc.data()
              retros.push({
                id: doc.id,
                name: data.name,
                timestamp: data.timestamp,
              })
            })

            retros.sort((a, b) => {
              return b.timestamp - a.timestamp
            })
            setCurrentRetros(retros)
            setValue('name', retroData?.name)
            setValue('columnsKey', retroData?.columnsKey)
            setValue('previousRetro', retroData?.previousRetro)
            setValue('endDate', retroData?.endDate)
            setValue('startDate', retroData?.startDate)
            setValue('numberOfVotes', retroData?.numberOfVotes)
            const foundRetro = retros.find(retro => retro.id === retroData?.previousRetro)
            if (foundRetro) {
              setPreviousRetro(foundRetro)
            } else {
              setPreviousRetro(null)
            }
          }
        })
        .catch(() => history.push('/retroList'))
    }
    fetchData()
  }, [auth.userId, history, id, setValue])
  const onSubmitHandler = (data: RetroForm) => {
    const retro = {
      ...data,
      previousRetro: previousRetroValue?.id,
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

  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Edit Retro</Typography>
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
            value={previousRetroValue}
            className={`${classes.inputField} ${classes.inputFieldText}`}
            options={currentRetros}
            onChange={(e, option) => setPreviousRetro(option)}
            getOptionLabel={(option: PreviousRetroType) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            renderInput={params => <TextField {...params} label="Previous Retro" />}
          />

          <Tooltip title="View your action items from a previous retro in your new retro!" aria-label="add">
            <HelpIcon fontSize="small" className={classes.helpIcon} />
          </Tooltip>
        </FormControl>
        <FormControl>
          <Controller
            name="startDate"
            control={control}
            defaultValue={moment().format('YYYY-MM-DD')}
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
            defaultValue={moment().format('YYYY-MM-DD')}
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

        <Button type="submit" color="secondary" variant="contained">
          Save Retro
        </Button>
      </form>
      <SnackBar
        open={response.open}
        message={response.message}
        status={response.status}
        close={() => setResponse({ open: false, message: '', status: '' })}
      />
    </Container>
  )
}

export default EditRetro
