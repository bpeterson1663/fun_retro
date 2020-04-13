import React, { useState } from "react";
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

const CommentItemDialog = props => {
  const { showCommentDialog } = props;
  const classes = useStyles();

  const [commentValue, setCommentValue] = useState("");
  const handleCommentClose = () => {
    props.handleCommentClose();
    setCommentValue("");
  };

  const onSubmitHandler = event => {
    event.preventDefault();
    props.addComment(commentValue, showCommentDialog.item);
    setCommentValue("");
  };
  return (
    <Dialog
      data-testid="comment_dialog"
      open={!!showCommentDialog.item}
      onClose={handleCommentClose}
    >
      <DialogTitle>
        <Typography variant="h6">Add a constructive comment</Typography>
        <Typography variant="subtitle1">Keep it positive!</Typography>

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
          className={[classes.inputField, classes.inputFieldText]}
          type="text"
          label="Start Typing"
          value={commentValue}
          onChange={e => setCommentValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onSubmitHandler} color="secondary" variant="contained">
          Add Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CommentItemDialog.propTypes = {
  showCommentDialog: PropTypes.object,
  handleCommentClose: PropTypes.func,
  addComment: PropTypes.func
};
export default CommentItemDialog;
