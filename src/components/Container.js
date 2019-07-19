import React, {useEffect} from 'react';
import Column from './Column';
import {db} from '../firebase';
import RetroContext from '../retro-context';
const RETRO_FORM_DEFAULT={
    keepDoing: [],
    stopDoing: [],
    startDoing: [],
    date: '',
    sprint: ''
}
const Container = () => {
    useEffect(() => {
        db.collection("retros")
        .get().then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data());
            console.log(data); // array of cities objects        
        });
    });
    return(
        <RetroContext.Provider value={RETRO_FORM_DEFAULT}>
            <Column title="Keep Doing" columnName="keepDoing" />
            <Column title="Stop Doing" columnName="stopDoing" />
            <Column title="Start Doing" columnName="startDoing" />
        </RetroContext.Provider>
    );
};

export default Container;

