import React, {useState} from 'react';
import RetroColumn from './RetroColumn';
import ls from 'local-storage'
import VoteContext from './vote-context';

const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState(ls.get(props.match.params.id) || 6);
    const retroId = props.match.params.id;
    
    const setVotes = (votes) => {
        ls.set(retroId, votes);
        setRemaingVotes(votes);
    }
    return(
        <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setVotes }}>
            Remaining Votes: {remaingVotes}
            <RetroColumn retroId={retroId} title="Keep Doing" columnName="keepDoing" />
            <RetroColumn retroId={retroId} title="Stop Doing" columnName="stopDoing" />
            <RetroColumn retroId={retroId} title="Start Doing" columnName="startDoing" />
        </VoteContext.Provider>
    );
};

export default RetroContainer;

