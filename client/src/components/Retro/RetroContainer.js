import React, {useState, useEffect, useContext} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from '../../context/vote-context';
import _ from 'lodash';
import useStyles from './Retro.styles';
import {db} from '../../firebase';
import api from '../../api/index';
import AuthContext from '../../context/auth-context';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography/Typography';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState('');
    const [retroData, setRetroData] = useState({});
    const [retroStatus, setRetroStatus] = useState(true);
    const [retroExists, setRetroExists] = useState(true);
    const auth = useContext(AuthContext);
    const retroId = props.match.params.id;
    const classes = useStyles();
    const columnMaps = [
        {title: 'Keep Doing', value: 'keepDoing', backgroundColor: '#009588'},
        {title: 'Stop Doing', value: 'stopDoing', backgroundColor: '#E91D63'},
        {title: 'Start Doing', value: 'startDoing', backgroundColor: '#9C28B0'}
    ];
    useEffect(() => {
        //TODO: figure out why useEffect is being triggered twice
        api.getRetroById(retroId).then(retro =>{
            if(retro.data){
                setRetroData(retro.data.retro);
                setRetroStatus(retroData.isActive);
                api.getAllItems(retroId).then(data => {
                    let voteCount = 0;
                    _.each(data.data.items, item => {
                        voteCount = voteCount + _.filter(item.votes, (vote) => vote === auth.userId).length;
                    });
                    if(typeof retroData.numberOfVotes === 'number'){
                        setRemaingVotes(retroData.numberOfVotes - (typeof voteCount === 'number' ? voteCount : 0) );
                    }
                });
            }else{
                setRetroExists(false);
            }
        }).catch( err => {
            setRetroExists(false);
        });
    },[retroId, retroData.isActive, retroData.numberOfVotes, auth.userId]);

    const handleRetroStatus = () => {
        
        db.collection('retros').doc(retroId)
            .update({isActive: !retroStatus })
            .then(() =>{
                setRetroStatus(!retroStatus);
            });
    };

    const handleGenerateReport = () => {
        api.getAllItems(retroId)
            .then((res) => {
                const allData = res.data.items;
                let doc = new jsPDF();

                _.each(columnMaps, (column, i) => {
                    let columnHeader = [column.title, 'Votes'];
                    let rows = [];
                    const section = _.filter(allData, item => item.columnName === column.value);
                    _.each(section, item => {
                        rows.push([item.value, item.votes.length]);
                    });                   
                    doc.autoTable({
                        headStyles: {fillColor: column.backgroundColor, halign: 'center'},
                        head: [columnHeader],
                        body:  _.orderBy(rows, x => x[1], ['desc']),
                        columnStyles: {
                            0: {cellWidth: 85},
                            1: {cellWidth: 20, halign: 'center'},
                          },
                        theme: 'grid'
                    });
                });
            
                doc.save(retroData.name+'.pdf');
            });
    };


    const retroContainer = (
        <Container data-id="retro_container">
            <Typography variant="h3">{retroData.name}</Typography>
            <Typography variant="subtitle1">{retroData.startDate} through {retroData.endDate}</Typography>
            <Typography variant="subtitle2">{retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}</Typography>
            {retroData.userId === auth.userId ? <Button size="small" color="secondary" onClick={handleRetroStatus}>{retroStatus ? `End Retro` : `Activate Retro`} </Button> : null}
            <Button size="small" color="secondary" onClick={handleGenerateReport}>Generate Report </Button>
            <Grid container justify="center" spacing={0}>
                <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setRemaingVotes }}>
                    <Grid className={classes.keepDoing} >
                        <RetroColumn retroId={retroId} votesPerPerson={props.numberOfVotes} title="Keep Doing" columnName="keepDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid className={classes.stopDoing}>
                        <RetroColumn retroId={retroId} votesPerPerson={props.numberOfVotes} title="Stop Doing" columnName="stopDoing" isActive={retroStatus}/>
                    </Grid>
                    <Grid className={classes.startDoing}>
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

