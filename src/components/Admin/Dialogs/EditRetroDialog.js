import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SnackBar from '../../Common/SnackBar';
import useStyles from '../AdminContainer.styles';

const EditRetroDialog = (props) => {
    const {name, startDate, endDate, numberOfVotes, id } = props.retro;

    const [nameValue, setNameValue] = useState();
    const [startDateValue, setStartDateValue] = useState();
    const [endDateValue, setEndDateValue] = useState();
    const [voteValue, setVoteValue] = useState();
    const [messageStatus, setMessageStatus] = useState(false);

    useEffect(() => {
        setNameValue(name);
        setStartDateValue(startDate);
        setEndDateValue(endDate);
        setVoteValue(numberOfVotes);
    }, [name, startDate, endDate, numberOfVotes]);

    const classes = useStyles();

    const onSubmitHandler = (event) => {
        event.preventDefault();
        debugger;
        props.updateRetro({
            id: id,
            name: nameValue,
            startDate: startDateValue,
            endDate: endDateValue,
            numberOfVotes: voteValue,
        });
    };

    const handleEditClose = () => {
        props.handleEditClose();
    };
    
    return (
        <Dialog
            data-id="create_dialog"
            open={props.editStatus}
            onClose={handleEditClose}>
            <DialogTitle>Edit Retro</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <TextField name="retro_name" required className={[classes.inputField, classes.inputFieldText]} type="text" label="Retro Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
                <TextField name="retro_vote" required className={classes.inputField} type="number" label="Votes Per Person" value={voteValue} onChange={(e) => setVoteValue(e.target.value)}/>
                <TextField name="retro_start" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="Start of Sprint" value={startDateValue} onChange={(e) => setStartDateValue(e.target.value)}/>
                <TextField name="retro_end" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="End of Sprint" value={endDateValue} onChange={(e) => setEndDateValue(e.target.value)}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={props.isLoading} onClick={onSubmitHandler} color="secondary" variant="contained" className={classes.submit}>Save</Button>
            </DialogActions>
            <SnackBar 
                open={messageStatus} 
                message={'Uh Oh! Looks like you forgot to fill something out!'} 
                status={'error'} 
                close={() => setMessageStatus(false)}/> 
        </Dialog>
    );
};

export default EditRetroDialog;