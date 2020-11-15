import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import SnackBar from '../../Common/SnackBar'
import useStyles from '../AdminContainer.styles'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { columnTitles } from '../../../constants/columns.constants'
import Autocomplete from '@material-ui/lab/Autocomplete'

const CreateRetroDialog = props => {
  const { currentRetros } = props
  const [nameValue, setNameValue] = useState('')
  const [startDateValue, setStartDateValue] = useState('')
  const [endDateValue, setEndDateValue] = useState('')
  const [voteValue, setVoteValue] = useState(6)
  const [columnValue, setColumnValue] = useState('')
  const [messageStatus, setMessageStatus] = useState(false)
  const [previousRetro, setPreviousRetro] = useState({})

  const classes = useStyles()
  const onSubmitHandler = event => {
    event.preventDefault()
    if (!nameValue || !startDateValue || !endDateValue || !voteValue) {
      setMessageStatus(true)
      return
    }

    props.submitRetro({
      name: nameValue,
      startDate: startDateValue,
      endDate: endDateValue,
      numberOfVotes: voteValue,
      columnsKey: columnValue,
      previousRetro: previousRetro.id,
    })
    resetToDefaults()
    handleCreateClose()
  }

  const handleCreateClose = () => {
    props.handleCreateClose()
  }
  const handleColumnsChange = event => setColumnValue(event.target.value)

  const resetToDefaults = () => {
    setColumnValue('')
    setNameValue('')
    setEndDateValue('')
    setStartDateValue('')
    setVoteValue(6)
    setPreviousRetro({})
  }

  return (
    <Dialog data-testid="create_dialog" open={props.createStatus} onClose={handleCreateClose}>
      <DialogTitle>
        <Typography>Create New Retro</Typography>
        <IconButton className={classes.closeButton} onClick={handleCreateClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <FormControl className={`${classes.inputField} ${classes.inputFieldText}`}>
          {' '}
          <InputLabel id="retro-type">Retro Type</InputLabel>
          <Select
            required
            data-testid="retro_type"
            labelId="retro-type"
            id="retro-type-select"
            value={columnValue}
            onChange={handleColumnsChange}
          >
            {columnTitles.map((columnsType, i) => {
              return (
                <MenuItem key={i} data-testid={`retro_type-${columnsType.value}`} value={columnsType.value}>
                  {columnsType.title}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <TextField
          inputProps={{ 'data-testid': 'retro_name' }}
          name="retro_name"
          required
          className={`${classes.inputField} ${classes.inputFieldText}`}
          type="text"
          label="Retro Name"
          value={nameValue}
          onChange={e => setNameValue(e.target.value)}
        />
        <FormControl className={`${classes.inputField} ${classes.inputFieldText}`}>
          <Autocomplete
            id="previous_retro"
            options={currentRetros}
            getOptionLabel={option => option.name}
            onChange={(e, newValue) => setPreviousRetro(newValue)}
            renderInput={params => <TextField {...params} label="Previous Retro" />}
          />
        </FormControl>
        <TextField
          inputProps={{ 'data-testid': 'retro_start' }}
          name="retro_start"
          required
          className={classes.inputField}
          type="date"
          InputLabelProps={{ shrink: true }}
          label="Start Date"
          value={startDateValue}
          onChange={e => setStartDateValue(e.target.value)}
        />
        <TextField
          inputProps={{ 'data-testid': 'retro_end' }}
          name="retro_end"
          required
          className={classes.inputField}
          type="date"
          InputLabelProps={{ shrink: true }}
          label="End Date"
          value={endDateValue}
          onChange={e => setEndDateValue(e.target.value)}
        />
        <TextField
          inputProps={{ 'data-testid': 'retro_vote' }}
          name="retro_vote"
          required
          className={classes.inputField}
          type="number"
          label="Votes Per Person"
          value={voteValue}
          onChange={e => setVoteValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          data-testid="admin_submit-retro"
          disabled={props.isLoading}
          onClick={onSubmitHandler}
          color="secondary"
          variant="contained"
          className={classes.submit}
        >
          Create
        </Button>
      </DialogActions>
      <SnackBar
        open={messageStatus}
        message={'Uh Oh! Looks like you forgot to fill something out!'}
        status={'error'}
        close={() => setMessageStatus(false)}
      />
    </Dialog>
  )
}

CreateRetroDialog.propTypes = {
  submitRetro: PropTypes.func,
  handleCreateClose: PropTypes.func,
  createStatus: PropTypes.bool,
  isLoading: PropTypes.bool,
  currentRetros: PropTypes.array,
}

export default CreateRetroDialog
