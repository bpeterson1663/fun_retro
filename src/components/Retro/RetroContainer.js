import React, {useState, useEffect, useContext} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from './vote-context';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';

const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState(6);
    const [retroData, setRetroData] = useState({});
    const [retroStatus, setRetroStatus] = useState(true);
    const auth = useContext(AuthContext);
    const retroId = props.match.params.id;

    useEffect(() => {
        db.collection('retros').doc(retroId)
            .get().then((doc) => {
                if(doc.exists){
                    setRetroData(doc.data());
                    setRetroStatus(retroData.isActive)
                }
            });
    },[retroId, retroData.isActive]);

    const handleEndRetro = () => {
        db.collection('retros').doc(retroId)
            .update({isActive: false })
            .then(() =>{
                setRetroStatus(false);
            });
    };
    return(
        <Container>
            <h2>{retroData.name}</h2>
            <Typography>{retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}</Typography>
            {retroData.userId === auth.userId && retroStatus ? <Button size="small" color="secondary" onClick={handleEndRetro}>End Retro</Button> : null}
            <Grid container justify="center" spacing={0}>
                <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setRemaingVotes }}>
                    <Grid item >
                        <RetroColumn retroId={retroId} title="Keep Doing" columnName="keepDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid item >
                        <RetroColumn retroId={retroId} title="Stop Doing" columnName="stopDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid item>
                        <RetroColumn retroId={retroId} title="Start Doing" columnName="startDoing" isActive={retroStatus}/>
                    </Grid>
                </VoteContext.Provider>
            </Grid>
        </Container>
    );
};

export default RetroContainer;

