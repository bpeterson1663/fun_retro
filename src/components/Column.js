import React, {useState, useContext} from 'react';
import Item from './Item';
import RetroContext from '../retro-context';

const Column = (props) => {
    const [addItem, setAddItem] = useState(false);
    const [itemList, setItemList] = useState([]);

    const retroForm = useContext(RetroContext)

    const setItemState = () => {
        setAddItem(addItem ? false : true);
    };
    
    const displayItemList = (item) => {
        setItemList(retroForm[props.columnName]);
    }

    return(
        <div>
            <h2>{props.title}</h2>
            <button onClick={setItemState.bind(this)}>Add New</button>
            {addItem ? <Item type={props.columnName} itemSubmitted={displayItemList}/> : null}
            {itemList.map((item, i) => {
                return <p key={i}>{item}</p>
            })}
        </div>
    );
};

export default Column;