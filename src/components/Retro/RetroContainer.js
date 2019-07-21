import React from 'react';
import RetroColumn from './RetroColumn';

const RetroContainer = () => {
    return(
        <div>
            <RetroColumn title="Keep Doing" columnName="keepDoing" />
            <RetroColumn title="Stop Doing" columnName="stopDoing" />
            <RetroColumn title="Start Doing" columnName="startDoing" />
        </div>
    );
};

export default RetroContainer;

