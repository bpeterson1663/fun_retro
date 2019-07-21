import React, {useReducer, useEffect, useRef} from 'react';
import {db} from '../../firebase';
import moment from 'moment';

const AdminContainer = () => {
    const nameValueRef = useRef();
    const dateValueRef = useRef();

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
                dispatch({type: 'SET', payload: querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                })});
            });
    }, []);

    const onSubmitHandler = (event) => {
        const nameValue = nameValueRef.current.value,
            dateValue = dateValueRef.current.value;
        event.preventDefault();
        db.collection('retros')
          .add({name: nameValue, date: dateValue})
          .then((res) =>{
            nameValueRef.current.value = '';
            dateValueRef.current.value = new moment().format('YYYY-MM-DD');
            dispatch({type: 'ADD', payload: {name: nameValue, date: dateValue}});
        });
    };

    const handleRetroDelete = (id) => {
        db.collection('retros')
          .doc(id)
          .delete()
          .then(() =>{
              dispatch({type: 'REMOVE', payload: id});
          });
    };
    return (
        <div>
            <h1>Admin Portal</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" placeholder="Retro Name" ref={nameValueRef}/>
                <input type="date" placeholder="Start of Sprint" ref={dateValueRef}/>
                <input type="submit" value="Submit" />
            </form>
            {retroList.map((retro, i) => {
               return <p key={i}>
                    Name: {retro.name}<br/>
                    Date: {retro.date}
                    <button onClick={handleRetroDelete.bind(this, retro.id)}>Delete</button>
                </p>
            })}
        </div>
    );  
};

export default AdminContainer;