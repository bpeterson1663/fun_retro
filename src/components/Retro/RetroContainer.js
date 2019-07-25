import React, {useState} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from './vote-context';

const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState(6);
    const retroId = props.match.params.id;

    return(
        <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setRemaingVotes }}>
            Remaining Votes: {remaingVotes}
            <RetroColumn retroId={retroId} title="Keep Doing" columnName="keepDoing" />
            <RetroColumn retroId={retroId} title="Stop Doing" columnName="stopDoing" />
            <RetroColumn retroId={retroId} title="Start Doing" columnName="startDoing" />
        </VoteContext.Provider>
    );
};

export default RetroContainer;

