import React, {useState, useEffect, useReducer} from 'react';
import {db} from '../../firebase';

const RetroColumn = (props) => {
    const [itemValue, setItemValue] = useState('');
    
    const itemListReducer = (state, action) => {
        switch(action.type){
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter((item) => item.id !== action.payload );
            default:
                return state;
        }
    };

    const [itemList, dispatch] = useReducer(itemListReducer, []);

    useEffect(() => {
        const unsubscirbe = db.collection(props.columnName)
            .onSnapshot(querySnapshot => {
                dispatch({type: 'SET', payload: querySnapshot.docs.map(doc => doc.data())})
            });
        return () => unsubscirbe();
    }, [props.columnName]);

    const onChangeHandler = (event) => {
        setItemValue(event.target.value);
    };

    const handleItemSubmit = (event) => {
        event.preventDefault();
        db.collection(props.columnName)
          .add({value: itemValue, retroId: 1})
          .then((res) =>{
            setItemValue('');
        });
    };
    
    return(
        <div>
            <h2>{props.title}</h2>
            <form onSubmit={handleItemSubmit.bind(this)}> 
                <textarea value={itemValue} onChange={onChangeHandler.bind(this)}></textarea>
                <input type="submit" value="Submit" />
            </form>
            {itemList.map((item, i) => {
                return <p key={i}>{item.value}</p>
            })}
        </div>
    );
};

export default RetroColumn;