import React, {useState, useEffect, useContext} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from './vote-context';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columnStyle = {
    borderRadius: 10,
    padding: 5,
    margin: '5px 10px',
    width: '30%'
};
const useStyles = makeStyles(theme => ({
    keepDoing: {
        backgroundColor: '#009588',
        ...columnStyle
    },
    stopDoing: {
        backgroundColor: '#E91D63',
        ...columnStyle
    },
    startDoing: {
        backgroundColor: '#9C28B0',
        ...columnStyle
    },
    container: {
        width: '100%',
        margin: 0
    }
}));
const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState('');
    const [retroData, setRetroData] = useState({});
    const [retroStatus, setRetroStatus] = useState(true);
    const [retroExists, setRetroExists] = useState(true);
    const [reportData, setReportData] = useState([])
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

    const handleGenerateReport = () => {

        const allData = Promise.all([
            db.collection('keepDoing')
            .where('retroId', '==', retroId).get(),
            db.collection('stopDoing')
            .where('retroId', '==', retroId).get(),
            db.collection('startDoing')
            .where('retroId', '==', retroId).get(),
        ]);
        //TODO: Refactor. You can do better
        allData.then((res) => {
                _.each(res, (querySnapshot) => {
                    setReportData(
                        reportData.push(querySnapshot.docs.map(doc => {
                            const data = doc.data();
                            data.id = doc.id;
                            return data;
                        }))
                    );
                });
                let columnsKeep = ['Keep Doing', 'Votes'];
                let rowsKeep = []
                let columnsStart = ['Start Doing', 'Votes'];
                let rowsStart = []
                let columnsStop = ['Stop Doing', 'Votes']
                let rowsStop = []
                let doc = new jsPDF();
                _.each(reportData[0], (item, i) => {
                    rowsKeep.push([item.value, item.votes])
                });
                _.each(reportData[1], item => {
                    rowsStop.push([item.value, item.votes])
                });
                _.each(reportData[2], item => {
                    rowsStart.push([item.value, item.votes])
                });
                doc.autoTable({
                    head: [columnsKeep],
                    body: rowsKeep
                });
                doc.autoTable({
                    head: [columnsStop],
                    body: rowsStop
                });
                doc.autoTable({
                    head: [columnsStart],
                    body: rowsStart
                });
                
                doc.save(retroData.name+'.pdf')
            });
    };


    const retroContainer = (
        <Container>
            <Typography variant="h3">{retroData.name}</Typography>
            <Typography variant="subtitle1">{retroData.startDate} through {retroData.endDate}</Typography>
            <Typography variant="subtitle2">{retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}</Typography>
            {retroData.userId === auth.userId ? <Button size="small" color="secondary" onClick={handleRetroStatus}>{retroStatus ? `End Retro` : `Activate Retro`} </Button> : null}
            {retroData.userId === auth.userId ? <Button size="small" color="secondary" onClick={handleGenerateReport}>Generate Report </Button> : null}
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
            <Typography variant="h3">Retro Does Not Exist</Typography>
        </Container>
    );

    return(
        retroExists ? retroContainer : retroDoesNotExist
    );
};

export default RetroContainer;

