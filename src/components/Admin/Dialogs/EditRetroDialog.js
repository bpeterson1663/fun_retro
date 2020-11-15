import React, { useState, useEffect } from 'react'
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
import FormControl from '@material-ui/core/FormControl'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SnackBar from '../../Common/SnackBar'
import useStyles from '../AdminContainer.styles'
import { getColumnsTitle } from '../../../constants/columns.constants'
const EditRetroDialog = props => {
  const { name, startDate, endDate, numberOfVotes, id, columnsKey, previousRetro } = props.retro
  const { currentRetros } = props
  const [nameValue, setNameValue] = useState()
  const [startDateValue, setStartDateValue] = useState()
  const [endDateValue, setEndDateValue] = useState()
  const [voteValue, setVoteValue] = useState()
  const [messageStatus, setMessageStatus] = useState(false)
  const [columnValue, setColumnValue] = useState('')
  const [previousRetroValue, setPreviousRetro] = useState({})

  useEffect(() => {
    setNameValue(name)
    setStartDateValue(startDate)
    setEndDateValue(endDate)
    setVoteValue(numberOfVotes)
    setPreviousRetro(currentRetros.find(retro => retro.id === previousRetro))
    columnsKey ? setColumnValue(columnsKey) : setColumnValue('keepDoing')
  }, [name, startDate, endDate, numberOfVotes, columnsKey, previousRetro, currentRetros])

  const classes = useStyles()

  const onSubmitHandler = event => {
    event.preventDefault()
    props.updateRetro({
      id: id,
      name: nameValue,
      startDate: startDateValue,
      endDate: endDateValue,
      numberOfVotes: voteValue,
      columnsKey: columnValue,
      previousRetro: previousRetroValue,
    })
  }

  const handleEditClose = () => {
    props.handleEditClose()
  }

  return (
    <Dialog data-id="edit_dialog" open={props.editStatus} onClose={handleEditClose}>
      <DialogTitle>
        <Typography>Edit Retro - {name}</Typography>
        <IconButton className={classes.closeButton} onClick={handleEditClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography>{getColumnsTitle(columnValue)}</Typography>
        <TextField
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
            value={previousRetroValue}
            renderInput={params => <TextField {...params} label="Previous Retro" />}
          />
        </FormControl>
        <TextField
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
          disabled={props.isLoading}
          onClick={onSubmitHandler}
          color="secondary"
          variant="contained"
          className={classes.submit}
        >
          Save
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
EditRetroDialog.propTypes = {
  retro: PropTypes.object,
  isLoading: PropTypes.bool,
  updateRetro: PropTypes.func,
  handleEditClose: PropTypes.func,
  editStatus: PropTypes.bool,
  currentRetros: PropTypes.array,
}
export default EditRetroDialog
