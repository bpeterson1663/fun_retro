import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
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
import { RetroType } from '../../../constants/types.constant'

interface ShowLinkProps {
  retroLink: RetroType
  showLinkStatus: boolean
  handleShowLinkClose: () => void
}

const ShowLinkDialog: React.FC<ShowLinkProps> = (props): JSX.Element => {
  const { retroLink, showLinkStatus, handleShowLinkClose } = props
  const [messageStatus, setMessageStatus] = useState(false)
  const copyToClipboard = () => {
    setMessageStatus(true)
  }
  const classes = useStyles()

  return (
    <Dialog data-id="show-link_dialog" open={showLinkStatus} onClose={handleShowLinkClose}>
      <DialogTitle>
        <Typography>Retro Link - {retroLink.name}</Typography>
        <IconButton className={classes.closeButton} onClick={handleShowLinkClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <a rel="noopener noreferrer" target="_blank" href={'https://superfunretro.herokuapp.com/retro/' + retroLink.id}>
          https://superfunretro.herokuapp.com/retro/{retroLink.id}
        </a>
      </DialogContent>
      <DialogActions>
        <CopyToClipboard text={'https://superfunretro.herokuapp.com/retro/' + retroLink.id} onCopy={copyToClipboard}>
          <Button size="small" variant="contained" color="secondary">
            Copy to clipboard
          </Button>
        </CopyToClipboard>
      </DialogActions>
      <SnackBar
        open={messageStatus}
        message={'Copy That!'}
        status={'success'}
        onClose={() => setMessageStatus(false)}
      />
    </Dialog>
  )
}

ShowLinkDialog.propTypes = {
  retroLink: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    team: PropTypes.array.isRequired,
    numberOfVotes: PropTypes.number.isRequired,
    columnsKey: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  showLinkStatus: PropTypes.bool.isRequired,
  handleShowLinkClose: PropTypes.func.isRequired,
}

export default ShowLinkDialog
