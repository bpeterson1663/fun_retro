import React from 'react';

const Column = (props) => {
    return(
        <div>
            <h2>{props.title}</h2>
            <button>Add New</button>
        </div>
    );
};

export default Column;