import React from 'react';

const retroContext = React.createContext({
    keepDoing: [],
    stopDoing: [],
    startDoing: [],
    date: '',
    sprint: ''
});

export default retroContext;