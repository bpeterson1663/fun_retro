import React, {useReducer, useEffect, useRef, useContext} from 'react';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import moment from 'moment';

const AdminContainer = () => {
    const nameValueRef = useRef();
    const dateValueRef = useRef();
    const auth = useContext(AuthContext);

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
        const nameValue = nameValueRef.current.value,
            dateValue = dateValueRef.current.value;
        event.preventDefault();
        db.collection('retros')
          .add({
              name: nameValue,
              date: dateValue,
              userId: auth.userId,
              isActive: true
            })
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
            <h1>Add Retro</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" placeholder="Retro Name" ref={nameValueRef}/>
                <input type="date" placeholder="Start of Sprint" ref={dateValueRef}/>
                <input type="submit" value="Submit" />
            </form>
            {retroList.length > 0 ? <h1>Retro List</h1> : null } 
            {retroList.map((retro, i) => {
               return <p key={i}>
                    Name: {retro.name}<br/>
                    Date: {retro.date}<br/>
                    Retro Link: <a  rel="noopener noreferrer" target="_blank" href={"https://superfunretro.herokuapp.com/retro/"+retro.id}>https://superfunretro.herokuapp.com/retro/{retro.id}</a><br/>
                    <button onClick={handleRetroDelete.bind(this, retro.id)}>Delete</button>
                </p>
            })}
        </div>
    );  
};

export default AdminContainer;