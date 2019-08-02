import React, {useState, useEffect, useContext} from 'react';
import {db, incrementCounter, decrementCounter} from '../../firebase';
import AuthContext from '../../context/auth-context';
import VoteContext from '../../context/vote-context';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(theme =>({
    inputField: {
        margin: '10px auto',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    button: {
        display: "inherit",
        margin: "auto"
    },
    card: {
        width: '100%',
        margin: '10px auto',
    },
    votes: {
        margin: 0,
        height: 20,
        width: 20,
        fontSize: 10,
        backgroundColor: theme.palette.primary.main
    },
    actionIcon: {
        marginLeft: 'auto'
    },
    placeHolder: {
        height: 5
    },
    iconPlaceHolder: {
        width: 23
    },
    header: {
        color: 'white'
    },
    avatar: {
        margin: 0,
        height: 30,
        width: 30,
        fontSize: 16,
        backgroundColor: theme.palette.primary.main
    },
    cardHeader: {
        padding: '10px 0 5px 0',
        float: 'right',
        margin: 0
    },
    cardConent: {
        paddingBottom: 0,
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all'
    },
    cardAction: {
        width: '100%'
    }

}));
const RetroColumn = (props) => {
    const [itemList, setItemList] = useState([]);
    const [trackedVotes, setTrackedVotes] = useState([]);
    const [itemValue, setItemValue] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [itemEdit, setItemEdit] = useState({})
    const auth = useContext(AuthContext);
    const vote = useContext(VoteContext);
    const classes = useStyles();
    useEffect(() => {
        const unsubscribe = db.collection(props.columnName)
            .where('retroId', '==', props.retroId)
            .onSnapshot(querySnapshot => {
                setItemList(querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                }));
                setLoading(false);
            });
        return () => unsubscribe();
    }, [props.columnName, props.retroId]);

    const handleItemSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        setItemValue('')
        db.collection(props.columnName)
          .add({
              value: itemValue,
              retroId: props.retroId,
              userId: auth.userId,
              votes: 0
            })
            .finally(() => setLoading(false));
    };

    const trackVote = (id, remove) => {
        if(remove){
            trackedVotes.splice(trackedVotes.indexOf(id), 1);
            setTrackedVotes(trackedVotes);
        } else{
            trackedVotes.push(id);
            setTrackedVotes(trackedVotes);
        }
    }

    const handleItemVote = (operation, item) =>{
        const itemRef = db.collection(props.columnName).doc(item.id);
        if(operation === 'addVote') {
            itemRef.update({votes: incrementCounter})
            vote.setRemaingVotes(--vote.votes);
            trackVote(item.id, false);
        }else {
            itemRef.update({votes: decrementCounter});
            vote.setRemaingVotes(++vote.votes);
            trackVote(item.id, true);
        }
    };

    const handleItemDelete = (id) => {
        setLoading(true);
        removeAllVotes(id);
        db.collection(props.columnName)
            .doc(id)
            .delete()
            .finally(() => setLoading(false));
    };

    const handleEditItem = (item) => {
        setEditMode(true);
        setItemEdit(item);
    };

    const resetEditMode = () => {
        setEditMode(false);
        setItemEdit({});
    };

    const handleUpdateItem = () => {
        setLoading(true);
        db.collection(props.columnName)
          .doc(itemEdit.id)
          .update({
              value: itemEdit.value
          })
          .then(() => resetEditMode())
          .finally(() => setLoading(false));
    };

    const removeAllVotes = (id) => {
        let count = 0;
        const newTrackedVotes = _.filter(trackedVotes, (trackedId) => {
            if(trackedId === id){count++}
            return trackedId !== id;
        });
        vote.setRemaingVotes(vote.votes + count);
        setTrackedVotes(newTrackedVotes);
    };

    const disableDeleteVotes = (id) => {
        const votesExist = _.filter(trackedVotes, (trackedId) => trackedId === id);
        return vote.votes === props.votesPerPerson || votesExist.length === 0;
    };

    const showThumbsDown = (id) => {
        return _.filter(trackedVotes, (trackedId) => trackedId === id).length > 0;
    };

    const getUsersVoteCount = (item) => {
        return _.filter(trackedVotes, (id) => id === item.id).length;
    };
    
    return(
        <Container>
            {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
            <Typography variant="h6" className={classes.header}>{props.title}</Typography>
            <form onSubmit={handleItemSubmit}> 
                <TextField placeholder="Start Typing"
                            required 
                            className={classes.inputField} variant="outlined" multiline rows="4" disabled={!props.isActive} value={itemValue} onChange={(e) => setItemValue(e.target.value)}></TextField>
                <Button className={classes.button} size="small" variant="contained" color="secondary" disabled={!props.isActive} type="submit" value="Add">Add</Button>
            </form>
            {itemList.map((item, i) => {
                return (
                    <Card key={i} className={classes.card}>   
                        <CardHeader 
                            className={classes.cardHeader}
                            avatar={
                                <Avatar className={classes.avatar}>
                                  {item.votes}
                                </Avatar>
                              }/>                        
                        <CardContent className={classes.cardConent}>
                            {editMode && itemEdit.id === item.id 
                                ? <TextField variant="outlined" multiline rows="3" value={itemEdit.value} onChange={(e) => setItemEdit({...itemEdit, value: e.target.value})}/> 
                                : item.value}
                        </CardContent>
                        <CardActions className={classes.cardAction}>
                            <Avatar className={classes.votes}>{ getUsersVoteCount(item) }</Avatar>
                            <IconButton disabled={vote.votes === 0 || !props.isActive} onClick={handleItemVote.bind(this, 'addVote', item)}>
                                <ThumbUp  />
                            </IconButton>
                            <IconButton disabled={disableDeleteVotes(item.id) || !props.isActive} onClick={handleItemVote.bind(this, 'removeVote', item)}>
                                {showThumbsDown(item.id) 
                                ? <ThumbDown />: <div className={classes.iconPlaceHolder}></div> }
                            </IconButton>
                            {auth.userId === item.userId ? (
                                editMode && itemEdit.id === item.id ?
                                <div>
                                    <IconButton className={classes.actionIcon} disabled={!props.isActive} onClick={handleUpdateItem.bind(this)}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton className={classes.actionIcon} disabled={!props.isActive} onClick={resetEditMode.bind(this, item)}>
                                        <CancelIcon />
                                    </IconButton>
                                </div>
                                : 
                                <IconButton className={classes.actionIcon} disabled={!props.isActive} onClick={handleEditItem.bind(this, item)}>
                                    <EditIcon />
                                </IconButton>
                            ) : null}                           
                            {auth.userId === item.userId ?
                            <IconButton className={classes.actionIcon} disabled={!props.isActive} onClick={handleItemDelete.bind(this, item.id)}>
                                <DeleteIcon />
                            </IconButton>
                            : null}
                        </CardActions>
                    </Card>
                );
            })}
        </Container>
    );
};

export default RetroColumn;