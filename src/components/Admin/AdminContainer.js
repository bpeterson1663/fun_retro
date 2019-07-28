import React, {useReducer, useEffect, useState, useContext} from 'react';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

const useStyles = makeStyles(theme => ({
    inputField: {
      margin: theme.spacing(2),
    },
    icon: {
        margin: theme.spacing(1),
        fontSize: 32,
        cursor: "pointer",
        float: "right"
    },
    placeholder: {
        height: 5
    }
}));
const AdminContainer = () => {
    const [nameValue, setNameValue] = useState('');
    const [dateValue, setDateValue] = useState(new moment().format('YYYY-MM-DD'));
    const [isLoading, setIsLoading] = useState(true);

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

    const onSubmitHandler = (event) => {
        event.preventDefault();
        setIsLoading(true);
        db.collection('retros')
          .add({
              name: nameValue,
              date: dateValue,
              userId: auth.userId,
              isActive: true
            })
          .then((res) =>{
            setNameValue('');
            setDateValue(new moment().format('YYYY-MM-DD'));
            dispatch({type: 'ADD', payload: {name: nameValue, date: dateValue, id: res.id}});
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
    return (
        <Container>
            {isLoading ? <LinearProgress variant="query"/> : <div className={classes.placeholder}></div>}
            <h1>Add Retro</h1>
            <form onSubmit={onSubmitHandler}>
                <TextField required className={classes.inputField} type="text" placeholder="Retro Name" onChange={(e) => setNameValue(e.target.value)}/>
                <TextField required className={classes.inputField} type="date" placeholder="Start of Sprint" onChange={(e) => setDateValue(e.target.value)}/>
                <Button type="submit" value="Submit" color="secondary" variant="contained">Create Retro</Button>
            </form>
            {retroList.length > 0 ? <h1>Retro List</h1> : null } 
            {retroList.map((retro, i) => {
               return <p key={i}>
                    <DeleteIcon className={classes.icon} onClick={handleRetroDelete.bind(this, retro.id)} color="secondary">Delete</DeleteIcon>
                    Name: {retro.name}<br/>
                    Date: {retro.date}<br/>
                    Retro Link: <a  rel="noopener noreferrer" target="_blank" href={"https://superfunretro.herokuapp.com/retro/"+retro.id}>https://superfunretro.herokuapp.com/retro/{retro.id}</a><br/>
                </p>
            })}
        </Container>
    );  
};

export default AdminContainer;