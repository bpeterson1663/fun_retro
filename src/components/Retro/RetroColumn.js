import React, {useState, useEffect} from 'react';
import {db} from '../../firebase';

const RetroColumn = (props) => {
    const [itemValue, setItemValue] = useState('');
    const [itemList, setItemList] = useState([]);

    useEffect(() => {
        const unsubscirbe = db.collection(props.columnName)
            .onSnapshot(querySnapshot => {
                setItemList(querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                }));
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

    const handleItemDelete = (id) => {
        db.collection(props.columnName)
            .doc(id)
            .delete();
    };
    
    return(
        <div>
            <h2>{props.title}</h2>
            <form onSubmit={handleItemSubmit.bind(this)}> 
                <textarea value={itemValue} onChange={onChangeHandler.bind(this)}></textarea>
                <input type="submit" value="Submit" />
            </form>
            {itemList.map((item, i) => {
                return (
                    <p key={i}>
                        {item.value}
                        <button onClick={handleItemDelete.bind(this, item.id)}>Delete</button>
                    </p>
                );
            })}
        </div>
    );
};

export default RetroColumn;