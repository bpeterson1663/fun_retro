import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Button from '@material-ui/core/Button'
import DialogComponent from '../../Common/DialogComponent'
import SnackBar from '../../Common/SnackBar'
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

  return (
    <DialogComponent
      open={showLinkStatus}
      onClose={handleShowLinkClose}
      title={`Retro Link - ${retroLink.name}`}
      actions={[
        <CopyToClipboard
          key={0}
          text={'https://superfunretro.herokuapp.com/retro/' + retroLink.id}
          onCopy={copyToClipboard}
        >
          <Button size="small" variant="contained" color="secondary">
            Copy to clipboard
          </Button>
        </CopyToClipboard>,
        <Button key={1} color="secondary" variant="outlined" onClick={handleShowLinkClose}>
          Cancel
        </Button>,
      ]}
    >
      <a rel="noopener noreferrer" target="_blank" href={'https://superfunretro.herokuapp.com/retro/' + retroLink.id}>
        https://superfunretro.herokuapp.com/retro/{retroLink.id}
      </a>
      {messageStatus ? (
        <SnackBar
          open={messageStatus}
          message={'Copy That!'}
          status={'success'}
          onClose={() => setMessageStatus(false)}
        />
      ) : null}
    </DialogComponent>
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
    columnsKey: PropTypes.any,
    isActive: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  showLinkStatus: PropTypes.bool.isRequired,
  handleShowLinkClose: PropTypes.func.isRequired,
}

export default ShowLinkDialog
