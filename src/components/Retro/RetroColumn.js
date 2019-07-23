import React, {useState, useEffect, useRef, useContext} from 'react';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';
import VoteContext from './vote-context';

const RetroColumn = (props) => {
    const [itemList, setItemList] = useState([]);
    const itemValueRef = useRef();
    const auth = useContext(AuthContext);
    const vote = useContext(VoteContext);

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
              userId: auth.userId,
              votes: 0
            })
          .then((res) =>{
            itemValueRef.current.value = null;
        });
    };

    const handleItemVote = (operation, item) =>{
        vote.setRemaingVotes(operation === 'remove' 
                            ? --vote.votes 
                            : ++vote.votes);
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
                        {auth.userId === item.userId ? <button onClick={handleItemDelete.bind(this, item.id)}>Delete</button> : null}
                        <button onClick={handleItemVote.bind(this, 'remove', item)}>Add Vote</button><button onClick={handleItemVote.bind(this, 'add', item)}>Remove Vote</button>
                    </p>
                );
            })}
        </div>
    );
};

export default RetroColumn;