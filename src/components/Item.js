import React, {useState, useContext} from 'react';
import RetroContext from '../retro-context';

const Item = (props) => {
    const [itemValue, setItemValue] = useState('');
    const retroForm = useContext(RetroContext);

    const onChangeHandler = (event) => {
        setItemValue(event.target.value);
    };

    const handleItemSubmit = (event) => {
        event.preventDefault();
        retroForm[props.type].push(itemValue);
        setItemValue('');
        props.itemSubmitted();
    };

    return (
        <form onSubmit={handleItemSubmit}> 
            <textarea value={itemValue} onChange={onChangeHandler}></textarea>
            <input type="submit" value="Submit" />
        </form>
    );
};

export default Item;