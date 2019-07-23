import React from 'react';
import RetroColumn from './RetroColumn';

const RetroContainer = (props) => {
    const retroId = props.match.params.id;
    return(
        <div>
            <RetroColumn retroId={retroId} title="Keep Doing" columnName="keepDoing" />
            <RetroColumn retroId={retroId} title="Stop Doing" columnName="stopDoing" />
            <RetroColumn retroId={retroId} title="Start Doing" columnName="startDoing" />
        </div>
    );
};

export default RetroContainer;

