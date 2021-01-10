import React, { useState } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'

const CommentItemDialog = props => {
  const { showCommentDialog } = props
  const classes = useStyles()

  const [commentValue, setCommentValue] = useState('')
  const handleCommentClose = () => {
    props.handleCommentClose()
    setCommentValue('')
  }

  const onSubmitHandler = event => {
    event.preventDefault()
    props.addComment(commentValue, showCommentDialog.item)
    setCommentValue('')
  }
  return (
    <DialogComponent
      open={!!showCommentDialog.item}
      onClose={handleCommentClose}
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
        maxLength="1000"
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
  showCommentDialog: PropTypes.object,
  handleCommentClose: PropTypes.func,
  addComment: PropTypes.func,
}
export default CommentItemDialog
