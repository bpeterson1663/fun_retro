import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import useStyles from "../Retro.styles";

const EditCommentDialog = props => {
  const { originalComment, item, i } = props.editComment;
  const classes = useStyles();

  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    setCommentValue(originalComment);
  }, [originalComment]);

  const handleCommentClose = () => {
    props.handleCommentClose();
    setCommentValue("");
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    props.editCommentHandler(commentValue, originalComment, item, i);
    setCommentValue("");
  };
  return (
    <Dialog
      data-testid="edit-comment_dialog"
      open={!!item}
      onClose={handleCommentClose}
    >
      <DialogTitle>
        <Typography>Edit comment</Typography>
        <IconButton
          className={classes.closeButton}
          onClick={handleCommentClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TextField
          variant="outlined"
          multiline
          rows="3"
          maxLength="1000"
          className={`${classes.inputField} ${classes.inputFieldText}`}
          type="text"
          label="Keep Typing"
          value={commentValue}
          onChange={e => setCommentValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!commentValue}
          onClick={onSubmitHandler}
          color="secondary"
          variant="contained"
        >
          Edit Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCommentDialog.propTypes = {
  editComment: PropTypes.object,
  handleCommentClose: PropTypes.func,
  editCommentHandler: PropTypes.func
};
export default EditCommentDialog;
