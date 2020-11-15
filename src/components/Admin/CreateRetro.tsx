import * as React from 'react'
import { useContext, useState } from 'react'
import Container from '@material-ui/core/Container'
import moment from 'moment'
import useStyles from './AdminContainer.styles'
import { useForm, Controller } from 'react-hook-form'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import { columnTitles } from '../../constants/columns.constants'
import MenuItem from '@material-ui/core/MenuItem'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import { RetroType } from '../../constants/types.constant'
import Button from '@material-ui/core/Button'
import SnackBar from '../Common/SnackBar'

const CreateRetro: React.FC = (): JSX.Element => {
  const { handleSubmit, control, errors, watch, reset } = useForm<RetroType>()
  const classes = useStyles()
  const auth = useContext(AuthContext)
  const [response, setResponse] = useState({open: false, status: '', message: ''})

  const onSubmitHandler = (data: RetroType) => {
    db.collection('retros')
      .add({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        userId: auth.userId,
        numberOfVotes: data.numberOfVotes,
        columnsKey: data.columnsKey,
        isActive: true,
        timestamp: moment().valueOf(),
      })
      .then(res => {
        setResponse({
            open: true,
            status: 'success',
            message: 'Retro was created successfully!'
        })
        reset({name: '', startDate: moment().format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD'), numberOfVotes: 6, columnsKey: columnTitles[0].value})
      })
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={classes.form}>
        <Controller
          name="name"
          control={control}
          defaultValue={''}
          rules={{
            required: "Your Retro won't be any fun without a name",
          }}
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
        <Controller
          name="columnsKey"
          control={control}
          rules={{
            required: 'Select a retro type',
          }}
          defaultValue={columnTitles[0].value}
          as={
            <Select data-testid="retro_type" required labelId="retro-type" id="retro-type-select" className={`${classes.inputField} ${classes.inputFieldText}`}>
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
        <Controller
          name="startDate"
          defaultValue={moment().format('YYYY-MM-DD')}
          control={control}
          rules={{
            required: 'Select a start date',
          }}
          as={
            <TextField
              inputProps={{ 'data-testid': 'retro_start' }}
              className={classes.inputField}
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              label="Start Date"
            />
          }
        />
        <Controller
          name="endDate"
          control={control}
          defaultValue={moment().format('YYYY-MM-DD')}
          rules={{
            required: 'Select an end date',
          }}
          as={
            <TextField
              inputProps={{ 'data-testid': 'retro_end' }}
              name="endDate"
              required
              className={classes.inputField}
              type="date"
              InputLabelProps={{ shrink: true }}
              label="End Date"
            />
          }
        />
        <Controller
          name="numberOfVotes"
          control={control}
          rules={{
            required: 'Number of votes is required',
          }}
          defaultValue={'6'}
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

        <Button type="submit" color="secondary" variant="contained">
          Create Retro
        </Button>
      </form>
      <SnackBar
        open={response.open}
        message={response.message}
        status={response.status}
        close={() => setResponse({open: false, message: '', status: '' })}
      />
    </Container>
  )
}

export default CreateRetro
