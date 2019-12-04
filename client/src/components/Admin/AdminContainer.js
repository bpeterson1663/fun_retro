import React, {useReducer, useEffect, useState, useContext} from 'react';
import moment from 'moment';
import api from '../../api/index';
import AuthContext from '../../context/auth-context';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditIcon from '@material-ui/icons/Edit';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography/Typography';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import useStyles from './AdminContainer.styles';
import SnackBar from '../Common/SnackBar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
//TODO: Move Dialog into a common component
const AdminContainer = () => {
    const [nameValue, setNameValue] = useState('');
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [voteValue, setVoteValue] = useState(6);
    const [editStatus, setEditStatus] = useState(false);
    const [editRetro, setEditRetro] = useState({});
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [retroIdToDelete, setRetroIdToDelete] = useState('')

    const [messageState, setMessageState] = useState({
        message: '',
        messageStatus: '',
        displayMessage: false,
    });           
    const auth = useContext(AuthContext);
    const classes = useStyles();
    const itemListReducer = (state, action) => {
        setIsLoading(false);
        switch(action.type){
            case 'ADD':
                setMessageState({
                    displayMessage: true,
                    message: `Way to go! You just created a Super Fun Retro!`,
                    messageStatus: 'success',
                });
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                setMessageState({
                    displayMessage: true,
                    message: 'Goodbye Retro! You have been deleted!',
                    messageStatus: 'success',
                });
                return state.filter((item) => item.id !== action.payload );
            default:
                return state;
        }
    };

    const [retroList, dispatch] = useReducer(itemListReducer, []);

    useEffect(() => {
        getAllRetros(auth.userId);
    }, [auth.userId]);

    const getAllRetros = (userId) => {
        api.getAllRetros(userId)
            .then(querySnapshot => {
                dispatch({type: 'SET', payload: querySnapshot.data.retros.map(retro => {
                    retro.id = retro._id;
                    return retro;
                })});
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        api.createRetro({
              name: nameValue,
              startDate: startDateValue,
              endDate: endDateValue,
              userId: auth.userId,
              numberOfVotes: voteValue,
              isActive: true
            })
        .then( res => {
            setNameValue('');
            setEndDateValue('');
            setStartDateValue('');
            setVoteValue(6);
            dispatch({
                type: 'ADD', 
                payload: {
                    name: nameValue, 
                    endDate: endDateValue, 
                    startDate: startDateValue, 
                    id: res.data.id
                }
            });
        })
        .catch(err => {
            setMessageState({
                displayMessage: true,
                message: err.message,
                messageStatus: 'error',
            });
        })
        .finally( () => {
            setIsLoading(false);
        });
    };

    const handleConfirmOpen = (id) => {
        setRetroIdToDelete(id)
        setConfirmDialogOpen(true);
    };
    
    const handleConfirmClose = () => {
        setRetroIdToDelete('')
        setConfirmDialogOpen(false);
    };

    const handleRetroDelete = (id) => {
        setIsLoading(true);
        //TODO: Delete all associated items
        api.deleteRetroById(id)
            .then(() => {
                handleConfirmClose();
                dispatch({type: 'REMOVE', payload: id});
            })
            .catch(err => {
                setMessageState({
                    displayMessage: true,
                    message: err.message,
                    messageStatus: 'error',
                });
            });      
    };

    const handleEditItem = (retro) => {
        setEditStatus(true);
        setEditRetro(retro);
    };

    const handleUpdateRetro = () => {
        setIsLoading(true);
        api.updateRetroById(editRetro.id, editRetro)
          .then(() => {
              setEditRetro({});
              setEditStatus(false);
              getAllRetros(auth.userId);
              setMessageState({
                displayMessage: true,
                message: `Oh yea! Way to make those changes!`,
                messageStatus: 'success',
            });
          })
          .finally(() => setIsLoading(false));
    };

    const handleMessageClose = () => {
        setMessageState({
            displayMessage: false,
            message: '',
            messageStatus: '',
        });
    };
    return (
        <Container data-id="admin_container">
            {isLoading ? <LinearProgress variant="query"/> : <div className={classes.placeholder}></div>}
            <Grid container justify="center" spacing={0}>
                <Grid item>
                    <Typography variant="h3">Create New Retro</Typography>
                    <form onSubmit={onSubmitHandler} className={classes.form}>
                        <TextField name="retro_name" required className={classes.inputField} type="text" label="Retro Name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
                        <TextField name="retro_vote" required className={classes.inputField} type="number" label="Votes Per Person" value={voteValue} onChange={(e) => setVoteValue(e.target.value)}/>
                        <TextField name="retro_start" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="Start of Sprint" value={startDateValue} onChange={(e) => setStartDateValue(e.target.value)}/>
                        <TextField name="retro_end" required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="End of Sprint" value={endDateValue} onChange={(e) => setEndDateValue(e.target.value)}/>
                        <Button type="submit" value="Submit" color="secondary" variant="contained" className={classes.submit}>Create</Button>
                    </form>
                </Grid>
                <Grid item>
                    {retroList.length > 0 ? <Typography variant="h3">Retro List</Typography> : null } 
                    {retroList.map((retro, i) => {
                        return (
                            <Card className={classes.card} key={i}>
                                {editStatus && editRetro.id === retro.id ?
                                <div>
                                    <TextField required className={classes.inputField} type="text" value={editRetro.name} label="Retro Name" onChange={(e) => setEditRetro({...editRetro, name: e.target.value})}/>
                                    <TextField required className={classes.inputField} type="number" label="Votes Per Person" value={editRetro.numberOfVotes} onChange={(e) => setEditRetro({...editRetro, numberOfVotes: e.target.value})}/>
                                </div>
                                :
                                <CardHeader
                                    className={classes.cardHeader}
                                    title={retro.name}
                                    />
                                }
                                <CardContent className={classes.cardContent}>
                                    { editStatus && editRetro.id === retro.id ?
                                    <div>
                                        <TextField required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} value={editRetro.startDate} label="Start of Sprint" onChange={(e) => setEditRetro({...editRetro, startDate: e.target.value})} />
                                        <TextField required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} value={editRetro.endDate} label="End of Sprint" onChange={(e) => setEditRetro({...editRetro, endDate: e.target.value})}/>
                                    </div>    
                                        :
                                        `${moment(retro.startDate).format('MM-DD-YYYY')} through ${moment(retro.endDate).format('MM-DD-YYYY')}`

                                    }
                                    <br/>
                                    Retro Link: <a  rel="noopener noreferrer" target="_blank" href={"https://superfunretro.herokuapp.com/retro/"+retro.id}>https://superfunretro.herokuapp.com/retro/{retro.id}</a><br/>
                                </CardContent>
                                <CardActions>
                                   {editStatus && editRetro.id === retro.id ?
                                    <div className={classes.icon}>
                                        <IconButton onClick={handleUpdateRetro.bind(this, retro)}>
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton onClick={() => setEditStatus(false)}>
                                            <CancelIcon />
                                        </IconButton>
                                    </div>
                                    : 
                                    <IconButton className={classes.icon} onClick={handleEditItem.bind(this, retro)}>
                                        <EditIcon />
                                    </IconButton>
                                }
                                    <IconButton className={classes.icon} onClick={handleConfirmOpen.bind(this, retro.id)}>
                                        <DeleteIcon data-id="delete_button">Delete</DeleteIcon>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        )
                    })}
                </Grid>
            </Grid>
            {messageState.displayMessage 
                ? <SnackBar 
                    open={messageState.displayMessage} 
                    message={messageState.message} 
                    status={messageState.messageStatus} 
                    close={handleMessageClose}/> 
                : null }
            <Dialog
                data-id="warning_dialog"
                open={confirmDialogOpen}
                onClose={handleConfirmClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Delete Retro?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to say goodbye to this retro and delete it?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button data-id="confirm-delete_button" onClick={handleRetroDelete.bind(this, retroIdToDelete)} color="secondary" variant="contained">
                        Delete It! 
                    </Button>
                    <Button data-id="cancel-delete_button" onClick={handleConfirmClose.bind(this)} color="primary" variant="contained" autoFocus>
                        No, Keep it.
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );  
};

export default AdminContainer;