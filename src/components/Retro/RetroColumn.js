import React, {useState, useEffect, useRef, useContext} from 'react';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';

const RetroColumn = (props) => {
    const [itemList, setItemList] = useState([]);
    const itemValueRef = useRef();
    const auth = useContext(AuthContext);

    useEffect(() => {
        const unsubscirbe = db.collection(props.columnName)
            .where('retroId', '==', props.retroId)
            .onSnapshot(querySnapshot => {
                setItemList(querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    return data;
                }));
            });
        return () => unsubscirbe();
    }, [props.columnName, props.retroId]);

    const handleItemSubmit = (event) => {
        event.preventDefault();
        const itemValue = itemValueRef.current.value;
        db.collection(props.columnName)
          .add({
              value: itemValue,
              retroId: props.retroId,
              userId: auth.userId
            })
          .then((res) =>{
            itemValueRef.current.value = null;
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
                <textarea ref={itemValueRef}></textarea>
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