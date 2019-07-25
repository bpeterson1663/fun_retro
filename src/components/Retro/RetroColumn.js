import React, {useState, useEffect, useRef, useContext} from 'react';
import {db, incrementCounter, decrementCounter} from '../../firebase';
import AuthContext from '../../auth-context';
import VoteContext from './vote-context';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Typography from '@material-ui/core/Typography/Typography';

const useStyles = makeStyles(theme => ({
    inputField: {
        margin: theme.spacing(1),
        width: 250
    },
    column: {
        width: 300,
        float: 'left'
    },
    button: {
        display: "inherit",
        margin: "auto"
    },
    card: {
        maxWidth: 290,
        margin: theme.spacing(1),
    },
    votes: {
        fontSize: '8px'
    },
    deleteIcon: {
        marginLeft: 28
    }
}));
const RetroColumn = (props) => {
    const [itemList, setItemList] = useState([]);
    const [trackedVotes, setTrackedVotes] = useState([])
    const [itemValue, setItemValue] = useState('')
    const auth = useContext(AuthContext);
    const vote = useContext(VoteContext);
    const classes = useStyles();
    useEffect(() => {
        const unsubscirbe = db.collection(props.columnName)
            .where('retroId', '==', props.retroId)
            .onSnapshot(querySnapshot => {
                setItemList(querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                }));
            });
        return () => unsubscirbe();
    }, [props.columnName, props.retroId]);

    const handleItemSubmit = (event) => {
        event.preventDefault();
        setItemValue('')
        db.collection(props.columnName)
          .add({
              value: itemValue,
              retroId: props.retroId,
              userId: auth.userId,
              votes: 0
            });
    };

    const trackVote = (item, remove) => {
        if(remove){
            trackedVotes.splice(trackedVotes.indexOf(item.id), 1);
            setTrackedVotes(trackedVotes);
        } else{
            trackedVotes.push(item.id);
            setTrackedVotes(trackedVotes);
        }
    }

    const handleItemVote = (operation, item) =>{
        const itemRef = db.collection(props.columnName).doc(item.id);
        if(operation === 'addVote') {
            itemRef.update({votes: incrementCounter})
            vote.setRemaingVotes(--vote.votes);
            trackVote(item, false);
        }else {
            itemRef.update({votes: decrementCounter});
            vote.setRemaingVotes(++vote.votes);
            trackVote(item, true);
        }
    };

    const handleItemDelete = (id) => {
        db.collection(props.columnName)
            .doc(id)
            .delete();
    };

    const disableDeleteVotes = (id) => {
        const votesExist = _.filter(trackedVotes, (trackedId) => trackedId === id);
        return vote.votes === 6 || votesExist.length === 0;
    };

    const getUsersVoteCount = (item) => {
        return _.filter(trackedVotes, (id) => id === item.id).length;
    };
    
    return(
        <Container className={classes.column}>
            <Typography>{props.title}</Typography>
            <form onSubmit={handleItemSubmit}> 
                <TextField required className={classes.inputField} variant="outlined" multiline rows="4" disabled={!props.isActive} onChange={(e) => setItemValue(e.target.value)}></TextField>
                <Button className={classes.button} size="small" variant="contained" color="secondary" disabled={!props.isActive} type="submit" value="Add">Add</Button>
            </form>
            {itemList.map((item, i) => {
                return (
                    <Card key={i} className={classes.card}>                           
                        <CardContent className={classes.cardConent}>
                            {item.value}
                        </CardContent>
                        <CardActions>
                            <div className={classes.votes}>
                            {getUsersVoteCount(item) ? <span>Your Votes: { getUsersVoteCount(item)}</span> : null}<br/>
                            <span >Total Votes: {item.votes}</span><br/>
                            </div>
                            <IconButton disabled={vote.votes === 0 || !props.isActive} onClick={handleItemVote.bind(this, 'addVote', item)}>
                                <ThumbUp  />
                            </IconButton>
                            <IconButton disabled={disableDeleteVotes(item.id) || !props.isActive} onClick={handleItemVote.bind(this, 'removeVote', item)}>
                                <ThumbDown/>
                            </IconButton>
                            {auth.userId === item.userId 
                                ?  <IconButton className={classes.deleteIcon}disabled={!props.isActive} onClick={handleItemDelete.bind(this, item.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                : null
                            }
                        </CardActions>
                    </Card>
                );
            })}
        </Container>
    );
};

export default RetroColumn;