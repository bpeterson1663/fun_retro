import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';
import useStyles from '../AdminContainer.styles';

const CreateRetro = props => {
    const [nameValue, setNameValue] = useState('');
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('');
    const [voteValue, setVoteValue] = useState(6);

    const classes = useStyles();

    const onSubmitHandler = (event) => {
        event.preventDefault();

        props.submitRetro({
            name: nameValue,
            startDate: startDateValue,
            endDate: endDateValue,
            numberOfVotes: voteValue,
        });
        setNameValue('');
        setEndDateValue('');
        setStartDateValue('');
        setVoteValue(6);
    };

    return (
        <Grid item>
            <Typography variant="h3">Create New Retro</Typography>
            <form onSubmit={onSubmitHandler} className={classes.form}>
                <TextField name="retro_name" required className={classes.inputField} type="text" label="Retro Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
                <TextField name="retro_vote" required className={classes.inputField} type="number" label="Votes Per Person" value={voteValue} onChange={(e) => setVoteValue(e.target.value)}/>
                <TextField name="retro_start" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="Start of Sprint" value={startDateValue} onChange={(e) => setStartDateValue(e.target.value)}/>
                <TextField name="retro_end" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="End of Sprint" value={endDateValue} onChange={(e) => setEndDateValue(e.target.value)}/>
                <Button disabled={props.isLoading} type="submit" value="Submit" color="secondary" variant="contained" className={classes.submit}>Create</Button>
            </form>
        </Grid>
    )
};

export default CreateRetro;