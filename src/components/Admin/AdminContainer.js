import React, {useReducer, useEffect, useState, useContext} from 'react';
import {db} from '../../firebase';
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

const AdminContainer = () => {
    const [nameValue, setNameValue] = useState('');
    const [startDateValue, setStartDateValue] = useState('');
    const [endDateValue, setEndDateValue] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [voteValue, setVoteValue] = useState(6);
    const [editStatus, setEditStatus] = useState(false);
    const [editRetro, setEditRetro] = useState({});
    const auth = useContext(AuthContext);
    const classes = useStyles();
    const itemListReducer = (state, action) => {
        setIsLoading(false);
        switch(action.type){
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((item) => item.id !== action.payload );
            default:
                return state;
        }
    };

    const [retroList, dispatch] = useReducer(itemListReducer, []);

    useEffect(() => {
        db.collection('retros')
        .where('userId', '==', auth.userId)
        .get()
        .then(querySnapshot => {
            dispatch({type: 'SET', payload: querySnapshot.docs.map(doc => {
                const data = doc.data();
                data.id = doc.id;
                return data;
            })});
        });
    }, [auth.userId]);

    const getAllRetros = () => {
        db.collection('retros')
        .where('userId', '==', auth.userId)
        .get()
        .then(querySnapshot => {
            dispatch({type: 'SET', payload: querySnapshot.docs.map(doc => {
                const data = doc.data();
                data.id = doc.id;
                return data;
            })});
        });
    };

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        db.collection('retros')
          .add({
              name: nameValue,
              startDate: startDateValue,
              endDate: endDateValue,
              userId: auth.userId,
              numberOfVotes: voteValue,
              isActive: true
            })
          .then((res) =>{
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
                    id: res.id
                }
            });
        });
    };

    const handleRetroDelete = (id) => {
        setIsLoading(true);
        db.collection('retros')
          .doc(id)
          .delete()
          .then(() =>{
              dispatch({type: 'REMOVE', payload: id});
          });
    };

    const handleEditItem = (retro) => {
        setEditStatus(true);
        setEditRetro(retro);
    };

    const handleUpdateRetro = () => {
        setIsLoading(true);
        db.collection('retros')
          .doc(editRetro.id)
          .update(editRetro)
          .then(() => {
              setEditRetro({});
              setEditStatus(false);
              getAllRetros();
          })
          .finally(() => setIsLoading(false));
    };
    return (
        <Container>
            {isLoading ? <LinearProgress variant="query"/> : <div className={classes.placeholder}></div>}
            <Grid container justify="center" spacing={0}>
                <Grid item>
                    <Typography variant="h3">Create New Retro</Typography>
                    <form onSubmit={onSubmitHandler} className={classes.form}>
                        <TextField required className={classes.inputField} type="text" label="Retro Name" onChange={(e) => setNameValue(e.target.value)}/>
                        <TextField required className={classes.inputField} type="number" label="Votes Per Person" value={voteValue} onChange={(e) => setVoteValue(e.target.value)}/>
                        <TextField required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="Start of Sprint" onChange={(e) => setStartDateValue(e.target.value)}/>
                        <TextField required className={classes.inputField} type="date" InputLabelProps={{ shrink: true }} label="End of Sprint" onChange={(e) => setEndDateValue(e.target.value)}/>
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
                                        `${retro.startDate} through ${retro.endDate}`

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
                                    <IconButton className={classes.icon} onClick={handleRetroDelete.bind(this, retro.id)}>
                                        <DeleteIcon>Delete</DeleteIcon>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        )
                    })}
                </Grid>
            </Grid>
        </Container>
    );  
};

export default AdminContainer;