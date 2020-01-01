import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackBar from '../../Common/SnackBar';
import useStyles from '../AdminContainer.styles';

const CreateRetro = props => {
    const [nameValue, setNameValue] = useState('');
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('');
    const [voteValue, setVoteValue] = useState(6);
    const [messageStatus, setMessageStatus] = useState(false);
    const classes = useStyles();

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if(!nameValue || !startDateValue || !endDateValue || !voteValue){
            setMessageStatus(true);
            return;
        }
        props.submitRetro({
            name: nameValue,
            startDate: startDateValue,
            endDate: endDateValue,
            numberOfVotes: voteValue,
        });
        resetToDefaults();
        handleCreateClose();
    };

    const handleCreateClose = () => {
        props.handleCreateClose();
    };

    const resetToDefaults = () => {
        setNameValue('');
        setEndDateValue('');
        setStartDateValue('');
        setVoteValue(6);
    };

    return (
        <Dialog
            data-id="create_dialog"
            open={props.createStatus}
            onClose={handleCreateClose}>
            <DialogTitle>Create New Retro</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                    <TextField name="retro_name" required className={[classes.inputField, classes.inputFieldText]} type="text" label="Retro Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
                    <TextField name="retro_start" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="Start of Sprint" value={startDateValue} onChange={(e) => setStartDateValue(e.target.value)}/>
                    <TextField name="retro_end" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="End of Sprint" value={endDateValue} onChange={(e) => setEndDateValue(e.target.value)}/>
                    <TextField name="retro_vote" required className={classes.inputField} type="number" label="Votes Per Person" value={voteValue} onChange={(e) => setVoteValue(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={props.isLoading} onClick={onSubmitHandler} color="secondary" variant="contained" className={classes.submit}>Create</Button>
            </DialogActions>
            <SnackBar 
                open={messageStatus} 
                message={'Uh Oh! Looks like you forgot to fill something out!'} 
                status={'error'} 
                close={() => setMessageStatus(false)}/> 
        </Dialog>
    )
};

export default CreateRetro;