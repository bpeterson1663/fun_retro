import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useStyles from "../Retro.styles";

const CreateItem = props => {
  const [itemValue, setItemValue] = useState("");

  const classes = useStyles();

  const handleSubmit = event => {
    event.preventDefault();
    props.itemSubmit(itemValue);
    setItemValue("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        placeholder="Start Typing"
        required
        className={classes.inputField}
        variant="outlined"
        multiline
        rows="4"
        disabled={!props.isActive}
        value={itemValue}
        onChange={e => setItemValue(e.target.value)}
      ></TextField>
      <Button
        className={classes.button}
        size="small"
        variant="contained"
        color="secondary"
        disabled={!props.isActive}
        type="submit"
        value="Add"
      >
        Add
      </Button>
    </form>
  );
};

export default CreateItem;
