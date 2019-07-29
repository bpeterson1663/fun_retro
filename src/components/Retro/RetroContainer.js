import React, {useState, useEffect, useContext} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from './vote-context';
import { makeStyles } from '@material-ui/core/styles';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';
const useStyles = makeStyles(theme => ({
    keepDoing: {
        backgroundColor: '#009588',
        borderRadius: 10,
        padding: 5,
        margin: '0 10px'
    },
    stopDoing: {
        backgroundColor: '#E91D63',
        borderRadius: 10,
        padding: 5,
        margin: '0 10px'
    },
    startDoing: {
        backgroundColor: '#9C28B0',
        borderRadius: 10,
        padding: 5,
        margin: '0 10px'
    }
}));
const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState('');
    const [retroData, setRetroData] = useState({});
    const [retroStatus, setRetroStatus] = useState(true);
    const [retroExists, setRetroExists] = useState(true);
    const auth = useContext(AuthContext);
    const retroId = props.match.params.id;
    const classes = useStyles();

    useEffect(() => {
        const unsubscribe = db.collection('retros').doc(retroId)
            .onSnapshot((doc) => {
                if(doc.exists){
                    setRetroData(doc.data());
                    setRetroStatus(retroData.isActive);
                    setRemaingVotes(retroData.numberOfVotes);
                }else{
                    setRetroExists(false);
                }
            });
        return () => unsubscribe();
    },[retroId, retroData.isActive, retroData.numberOfVotes]);

    const handleRetroStatus = () => {
        db.collection('retros').doc(retroId)
            .update({isActive: !retroStatus })
            .then(() =>{
                setRetroStatus(!retroStatus);
            });
    };

    const retroContainer = (
        <Container>
            <h2>{retroData.name}</h2>
            <Typography>{retroData.startDate} through {retroData.endDate}</Typography>
            <Typography>{retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}</Typography>
            {retroData.userId === auth.userId ? <Button size="small" color="secondary" onClick={handleRetroStatus}>{retroStatus ? `End Retro` : `Activate Retro`} </Button> : null}
            <Grid container justify="center" spacing={0}>
                <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setRemaingVotes }}>
                    <Grid item className={classes.keepDoing} >
                        <RetroColumn retroId={retroId} votesPerPerson={props.numberOfVotes} title="Keep Doing" columnName="keepDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid item className={classes.stopDoing}>
                        <RetroColumn retroId={retroId} votesPerPerson={props.numberOfVotes} title="Stop Doing" columnName="stopDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid item className={classes.startDoing}>
                        <RetroColumn retroId={retroId} votesPerPerson={props.numberOfVotes} title="Start Doing" columnName="startDoing" isActive={retroStatus}/>
                    </Grid>
                </VoteContext.Provider>
            </Grid>
        </Container>
    );

    const retroDoesNotExist = (
        <Container>
            <h1>Retro Does Not Exist</h1>
        </Container>
    );

    return(
        retroExists ? retroContainer : retroDoesNotExist
    );
};

export default RetroContainer;

