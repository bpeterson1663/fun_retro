
import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackBar from '../../Common/SnackBar';

const ShowLinkDialog = (props) => {
    const {retroLink, showLinkStatus, handleShowLinkClose } = props;
    const [messageStatus, setMessageStatus] = useState(false);
    const copyToClipboard = () => {
        setMessageStatus(true);
    };

    return (
        <Dialog
            data-id="show-link_dialog"
            open={showLinkStatus}
            onClose={handleShowLinkClose}>
            <DialogTitle id="alert-dialog-title">{"Retro Link"}</DialogTitle>
            <DialogContent>
                <a  rel="noopener noreferrer" target="_blank" href={"https://superfunretro.herokuapp.com/retro/"+retroLink.id}>https://superfunretro.herokuapp.com/retro/{retroLink.id}</a>
            </DialogContent>
            <DialogActions>
                <CopyToClipboard
                    text={"https://superfunretro.herokuapp.com/retro/"+retroLink.id}
                    onCopy={copyToClipboard}>
                    <Button size="small" variant="outlined" color="secondary">Copy to clipboard</Button>
                </CopyToClipboard>
            </DialogActions>
            <SnackBar 
                open={messageStatus} 
                message={'Copy That!'} 
                status={'success'} 
                close={() => setMessageStatus(false)}/> 
        </Dialog>
    );
};

export default ShowLinkDialog;