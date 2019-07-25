import React, {useState, useEffect, useRef, useContext} from 'react';
import {db, incrementCounter, decrementCounter} from '../../firebase';
import AuthContext from '../../auth-context';
import VoteContext from './vote-context';
import _ from 'lodash';

const RetroColumn = (props) => {
    const [itemList, setItemList] = useState([]);
    const [trackedVotes, setTrackedVotes] = useState([])
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

    const trackVote = (item, remove) => {
        if(remove){
            trackedVotes.splice(trackedVotes.indexOf(item.id), 1);
            setTrackedVotes(trackedVotes);
        } else{
            trackedVotes.push(item.id);
            setTrackedVotes(trackedVotes);
        }
    }

    const handleItemVote = (operation, item) =>{
        const itemRef = db.collection(props.columnName).doc(item.id);
        if(operation === 'addVote') {
            itemRef.update({votes: incrementCounter})
            vote.setRemaingVotes(--vote.votes);
            trackVote(item, false);
        }else {
            itemRef.update({votes: decrementCounter});
            vote.setRemaingVotes(++vote.votes);
            trackVote(item, true);
        }
    };

    const handleItemDelete = (id) => {
        db.collection(props.columnName)
            .doc(id)
            .delete();
    };

    const disableDeleteVotes = (id) => {
        const votesExist = _.filter(trackedVotes, (trackedId) => trackedId === id);
        return vote.votes === 6 || votesExist.length === 0;
    };

    const getUsersVoteCount = (item) => {
        return _.filter(trackedVotes, (id) => id === item.id).length;
    };
    
    return(
        <div>
            <h2>{props.title}</h2>
            <form onSubmit={handleItemSubmit.bind(this)}> 
                <textarea disabled={!props.isActive} ref={itemValueRef}></textarea>
                <input disabled={!props.isActive} type="submit" value="Submit" />
            </form>
            {itemList.map((item, i) => {
                return (
                    <p key={i}>
                        {item.value}
                        {getUsersVoteCount(item) ? `Your Votes: ${ getUsersVoteCount(item)}` : null}<br/>
                        Total Votes: {item.votes}<br/>
                        {auth.userId === item.userId ? <button disabled={!props.isActive} onClick={handleItemDelete.bind(this, item.id)}>Delete</button> : null}
                        <button disabled={vote.votes === 0 || !props.isActive} onClick={handleItemVote.bind(this, 'addVote', item)}>Add Vote</button>
                        <button disabled={disableDeleteVotes(item.id) || !props.isActive} onClick={handleItemVote.bind(this, 'removeVote', item)}>Remove Vote</button>
                    </p>
                );
            })}
        </div>
    );
};

export default RetroColumn;