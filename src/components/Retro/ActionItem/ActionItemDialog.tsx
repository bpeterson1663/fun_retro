import React, { useState } from 'react'
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
  createActionItem: (item: any) => void
  team: ManageTeamsType[]
  retros: RetroType[] | null
}
const ActionItemDialog: React.FC<DialogPropTypes> = (props): JSX.Element => {
  const { showActionItemDialog, handleActionItemDialogClose, createActionItem, team, retros } = props
  const [teamValue, setTeamValue] = useState<ManageTeamsType[]>([])
  const [retroValue, setRetroValue] = useState<RetroType | null>({} as RetroType)
  const [itemValue, setItemValue] = useState('')
  const classes = useStyles()

  const handleCreateActionItem = () => {
    if (!itemValue) {
      return
    }
    createActionItem({
      value: itemValue,
      team: teamValue.length > 0 ? teamValue : [],
      retroId: retroValue ? retroValue.id : '',
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

export default ActionItemDialog
