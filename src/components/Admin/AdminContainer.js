import React, {useState, useReducer, useEffect} from 'react';
import {db} from '../../firebase';

import moment from 'moment';
const AdminContainer = () => {
    const [nameValue, setNameValue] = useState('');
    const [dateValue, setDateValue] = useState(new moment().format('YYYY-MM-DD'));
    
    const itemListReducer = (state, action) => {
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
            .get()
            .then(querySnapshot => {
                dispatch({type: 'SET', payload: querySnapshot.docs.map(doc => doc.data())})
            });
    }, []);

    const onChangeHandler = (event, type) =>{
        switch(type){
            case 'name':
                setNameValue(event.target.value);
                break;
            case 'date':
                setDateValue(event.target.value);
                break;
            default:
                return;
        }
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();
        db.collection('retros')
          .add({name: nameValue, date: dateValue})
          .then((res) =>{
            setNameValue('');
            dispatch({type: 'ADD', payload: {name: nameValue, date: dateValue}});

        });
    };
    return (
        <div>
            <h1>Admin Portal</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" placeholder="Retro Name" value={nameValue} onChange={(event) => onChangeHandler(event, 'name')}/>
                <input type="date" placeholder="Start of Sprint" value={dateValue} onChange={(event) => onChangeHandler(event, 'date')}/>
                <input type="submit" value="Submit" />
            </form>
            {retroList.map((retro, i) => {
               return <p key={i}>{retro.name} {retro.date}</p>
            })}
        </div>
    );  
};

export default AdminContainer;