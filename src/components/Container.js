import React from 'react';
import Column from './Column';

import RetroContext from '../retro-context';
const RETRO_FORM_DEFAULT={
    keepDoing: [],
    stopDoing: [],
    startDoing: [],
    date: '',
    sprint: ''
}
const Container = () => {
    
    return(
        <RetroContext.Provider value={RETRO_FORM_DEFAULT}>
            <Column title="Keep Doing" columnName="keepDoing" />
            <Column title="Stop Doing" columnName="stopDoing" />
            <Column title="Start Doing" columnName="startDoing" />
        </RetroContext.Provider>
    );
};

export default Container;

