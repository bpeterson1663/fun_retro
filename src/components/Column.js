import React, {useState, useEffect} from 'react';
import {db} from '../firebase';

const Column = (props) => {
    const [itemList, setItemList] = useState([]);
    const [itemValue, setItemValue] = useState('');

    useEffect(() => {
        const unsubscirbe = db.collection(props.columnName)
            .onSnapshot(querySnapshot => {
                setItemList(querySnapshot.docs.map(doc => doc.data()));
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
            setItemList(itemList.concat([{value: itemValue, retroId: 1}]));
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

export default Column;