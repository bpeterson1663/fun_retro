import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ManageTeamsType, RetroType } from '../../../constants/types.constant'
import dayjs from 'dayjs'
const useStyles = makeStyles(theme => ({
  inputField: {
    margin: theme.spacing(2),
  },
  inputFieldText: {
    width: '38rem',
  },
  dialogContent: {
    width: 500,
    margin: 'auto',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
  },
}))
interface DialogPropTypes {
  showActionItemDialog: boolean
  handleActionItemDialogClose: () => void
  createActionItem: (item: {
    value: string
    team: ManageTeamsType[]
    retroId: string
    owner: string
    timestamp: number
  }) => void
  team: ManageTeamsType[]
  retros: RetroType[] | null
}
const CreateActionItemDialog: React.FC<DialogPropTypes> = (props): JSX.Element => {
  const { showActionItemDialog, handleActionItemDialogClose, createActionItem, team, retros } = props
  const [teamValue, setTeamValue] = useState<ManageTeamsType[]>([])
  const [retroValue, setRetroValue] = useState<RetroType | null>({} as RetroType)
  const [itemValue, setItemValue] = useState('')
  const [ownerValue, setOwnerValue] = useState('')
  const classes = useStyles()

  const handleCreateActionItem = () => {
    if (!itemValue) {
      return
    }
    createActionItem({
      value: itemValue,
      team: teamValue.length > 0 ? teamValue : [],
      retroId: retroValue?.id ? retroValue.id : '',
      owner: ownerValue ? ownerValue : '',
      timestamp: dayjs().valueOf(),
    })
    setItemValue('')
  }
  return (
    <Dialog data-testid="actionitem_dialog" open={showActionItemDialog} onClose={handleActionItemDialogClose}>
      <DialogTitle>
        <Typography>Create Action Item</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          className={`${classes.inputField} ${classes.inputFieldText}`}
          variant="outlined"
          multiline
          required
          rows="3"
          type="text"
          label="Start Typing"
          value={itemValue}
          onChange={e => setItemValue(e.target.value)}
        />
        <TextField
          className={`${classes.inputField} ${classes.inputFieldText}`}
          value={ownerValue}
          type="text"
          variant="outlined"
          label="Owner"
          onChange={e => setOwnerValue(e.target.value)}
        />
        {retros ? (
          <Autocomplete
            className={`${classes.inputField} ${classes.inputFieldText}`}
            filterSelectedOptions
            value={retroValue}
            options={retros}
            onChange={(e, option) => setRetroValue(option)}
            getOptionLabel={(option: RetroType) => (option?.name ? option.name : '')}
            getOptionSelected={(option, value) => option.name === value.name}
            renderInput={params => <TextField {...params} label="Retro" />}
          />
        ) : null}
        <Autocomplete
          className={`${classes.inputField} ${classes.inputFieldText}`}
          multiple
          filterSelectedOptions
          value={teamValue}
          defaultValue={[]}
          options={team}
          onChange={(e, option) => setTeamValue(option)}
          getOptionLabel={(option: ManageTeamsType) => option.teamName}
          getOptionSelected={(option, value) => option.teamName === value.teamName}
          renderInput={params => <TextField {...params} label="Team(s)" />}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={handleCreateActionItem}>
          Create
        </Button>
        <Button color="secondary" variant="outlined" onClick={handleActionItemDialogClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CreateActionItemDialog.propTypes = {
  showActionItemDialog: PropTypes.bool.isRequired,
  handleActionItemDialogClose: PropTypes.func.isRequired,
  createActionItem: PropTypes.func.isRequired,
  team: PropTypes.array.isRequired,
  retros: PropTypes.array.isRequired,
}
export default CreateActionItemDialog
