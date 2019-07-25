import React, {useState, useEffect, useContext} from 'react';
import RetroColumn from './RetroColumn';
import VoteContext from './vote-context';
import {db} from '../../firebase';
import AuthContext from '../../auth-context';

const RetroContainer = (props) => {
    const [remaingVotes, setRemaingVotes] = useState(6);
    const [retroData, setRetroData] = useState({});
    const [retroStatus, setRetroStatus] = useState(true);
    const auth = useContext(AuthContext);
    const retroId = props.match.params.id;

    useEffect(() => {
        db.collection('retros').doc(retroId)
            .get().then((doc) => {
                if(doc.exists){
                    setRetroData(doc.data());
                    setRetroStatus(retroData.isActive)
                }
            });
    },[retroId, retroData.isActive]);

    const handleEndRetro = () => {
        db.collection('retros').doc(retroId)
            .update({isActive: false })
            .then(() =>{
                setRetroStatus(false);
            });
    };
    return(
        <VoteContext.Provider value={{votes: remaingVotes, setRemaingVotes: setRemaingVotes }}>
            {retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}
            <RetroColumn retroId={retroId} title="Keep Doing" columnName="keepDoing" isActive={retroStatus}/>
            <RetroColumn retroId={retroId} title="Stop Doing" columnName="stopDoing" isActive={retroStatus}/>
            <RetroColumn retroId={retroId} title="Start Doing" columnName="startDoing" isActive={retroStatus}/>
            {retroData.userId === auth.userId && retroStatus ? <button onClick={handleEndRetro}>End Retro</button> : null}
        </VoteContext.Provider>
    );
};

export default RetroContainer;

