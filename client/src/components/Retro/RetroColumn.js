import React, {useState, useEffect, useContext} from 'react';
import {db, incrementCounter, decrementCounter} from '../../firebase';
import api from '../../api/index';
import AuthContext from '../../context/auth-context';
import VoteContext from '../../context/vote-context';
import _ from 'lodash';
import moment from 'moment';
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
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import useStyles from './Retro.styles';

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
        //TODO: Replace with Stream
        api.getAllItemsByColumn(props.retroId, props.columnName)
            .then( items => {
                const columnData = items.data.items.map(item => {
                    item.id = item._id;
                    return item;
                }).sort((a,b) => {return moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf() });
                setItemList(columnData);
                setLoading(false);
            })
            .catch( err => {
                setLoading(false);
            });

    }, [props.columnName, props.retroId]);
    
    const getColumnList = () => {
        api.getAllItemsByColumn(props.retroId, props.columnName)
            .then( items => {
                const columnData = items.data.items.map(item => {
                    item.id = item._id;
                    return item;
                }).sort((a,b) => {return moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf() });
                setItemList(columnData);
                setLoading(false);
            })
    };

    const handleItemSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        setItemValue('')
        api.createItem({
                value: itemValue,
                retroId: props.retroId,
                userId: auth.userId,
                votes: [],
                columnName: props.columnName,
                timestamp: new moment().valueOf()
            }).then(() => {
                setLoading(false);
                //TODO: Replace with Stream
                getColumnList();
            });
    };

    const handleItemVote = (operation, item) =>{
        api.getItemById(item.id).then( res => {
            let resItem = res.data.item;
            if(operation === 'addVote') {
                resItem.votes.push(auth.userId);

            }else {
                resItem.votes.splice(resItem.votes.indexOf(auth.userId), 1);
            }
            api.updateItem(resItem._id, resItem).then(() => {
                vote.setRemaingVotes(operation === 'addVote' ? --vote.votes : ++vote.votes);
                //TODO: Replace with Stream
                getColumnList();
            }).catch(err => {
                console.log(err);
            });
        });
        
    };

    const handleItemDelete = (id) => {
        setLoading(true);
        api.deleteItem(id).then(() => {
            setLoading(false);
            //TODO: Replace with Stream
            getColumnList(); 
        })
        .catch(err => {
            //TODO: Display Error Message
            setLoading(false);
            //TODO: Replace with Stream
            getColumnList();
        });
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
        api.updateItem(itemEdit.id, itemEdit)
        .then(() => {
            resetEditMode();
            //TODO: Replace with Stream
            getColumnList();
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            //TODO: Replace with Stream
            getColumnList();
        });
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

    const disableDeleteVotes = (item) => {
        const votesExist = _.filter(item.votes, vote => vote === auth.userId);
        console.log("votesExist: ", votesExist);
        return vote.votes === props.votesPerPerson || votesExist.length === 0;
    };

    const showThumbsDown = (item) => {
        return _.filter(item.votes, (vote) => vote === auth.userId).length > 0;
    };

    const getUsersVoteCount = (item) => {
        return _.filter(item.votes, (vote) => vote === auth.userId).length;
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
                                  {item.votes.length}
                                </Avatar>
                              }/>                        
                        <CardContent className={classes.cardConent}>
                            {editMode && itemEdit.id === item.id 
                                ? <TextField variant="outlined" multiline rows="3" maxLength="1000" value={itemEdit.value} onChange={(e) => setItemEdit({...itemEdit, value: e.target.value})}/> 
                                : item.value}
                        </CardContent>
                        <CardActions className={classes.cardAction}>
                            <div className={classes.voteContainer}>
                                <Avatar className={classes.votes}>{ getUsersVoteCount(item) }</Avatar>
                                <IconButton disabled={vote.votes === 0 || !props.isActive} onClick={handleItemVote.bind(this, 'addVote', item)}>
                                    <ThumbUp  />
                                </IconButton>
                                {showThumbsDown(item) 
                                ? <Button className={classes.remove} disabled={disableDeleteVotes(item) || !props.isActive} onClick={handleItemVote.bind(this, 'removeVote', item)} vairant="outlined" sizeSmall>Remove Vote</Button> 
                                : null }
                            </div>
                            {auth.userId === item.userId 
                            ? (editMode && itemEdit.id === item.id ?
                                <div className={classes.editContainer}>
                                    <IconButton disabled={!props.isActive} onClick={handleUpdateItem.bind(this)}>
                                        <SaveIcon />
                                    </IconButton>
                                    <IconButton disabled={!props.isActive} onClick={resetEditMode.bind(this, item)}>
                                        <CancelIcon />
                                    </IconButton>
                                </div>
                                :
                                <div className={classes.editContainer}> 
                                    <IconButton disabled={!props.isActive} onClick={handleEditItem.bind(this, item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton disabled={!props.isActive || isLoading} onClick={handleItemDelete.bind(this, item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            ) : null}
                        </CardActions>
                    </Card>
                );
            })}
        </Container>
    );
};

export default RetroColumn;