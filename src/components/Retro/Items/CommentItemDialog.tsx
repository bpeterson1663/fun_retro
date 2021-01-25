import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'
import { ItemT } from '../../../constants/types.constants'

interface CommentItemDialogT {
  showCommentDialog: { item: ItemT }
  handleCommentClose: () => void
  addComment: (commentValue: string, item: ItemT) => void
}
const CommentItemDialog: React.FC<CommentItemDialogT> = (props): JSX.Element => {
  const { showCommentDialog, handleCommentClose, addComment } = props
  const classes = useStyles()

  const [commentValue, setCommentValue] = useState('')
  const commentClose = () => {
    handleCommentClose()
    setCommentValue('')
  }

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault()
    addComment(commentValue, showCommentDialog.item)
    setCommentValue('')
  }
  return (
    <DialogComponent
      open={!!showCommentDialog.item}
      onClose={commentClose}
      title="Add a constructive comment"
      actions={
        <Button disabled={!commentValue} onClick={onSubmitHandler} color="secondary" variant="contained">
          Add Comment
        </Button>
      }
    >
      <TextField
        variant="outlined"
        multiline
        rows="3"
        data-testid="add-comment"
        className={`${classes.inputField} ${classes.inputFieldText}`}
        type="text"
        label="Start Typing"
        value={commentValue}
        onChange={e => setCommentValue(e.target.value)}
      />
    </DialogComponent>
  )
}

CommentItemDialog.propTypes = {
  showCommentDialog: PropTypes.shape({
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      retroId: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
      voteMap: PropTypes.array.isRequired,
      timestamp: PropTypes.number.isRequired,
      comments: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  handleCommentClose: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
}
export default CommentItemDialog
