import React from 'react';
import Column from './Column';

const Container = () => {
    return(
        <div>
            <Column title="Keep Doing" columnName="keepDoing" />
            <Column title="Stop Doing" columnName="stopDoing" />
            <Column title="Start Doing" columnName="startDoing" />
        </div>
    );
};

export default Container;

