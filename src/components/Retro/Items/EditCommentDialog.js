import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'

const EditCommentDialog = props => {
  const { originalComment, item, i } = props.editComment
  const classes = useStyles()

  const [commentValue, setCommentValue] = useState('')

  useEffect(() => {
    setCommentValue(originalComment)
  }, [originalComment])

  const handleCommentClose = () => {
    props.handleCommentClose()
    setCommentValue('')
  }

  const onSubmitHandler = event => {
    event.preventDefault()
    props.editCommentHandler(commentValue, originalComment, item, i)
    setCommentValue('')
  }
  return (
    <DialogComponent
      open={!!item}
      onClose={handleCommentClose}
      title="Edit Comment"
      actions={
        <Button disabled={!commentValue} onClick={onSubmitHandler} color="secondary" variant="contained">
          Edit Comment
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
        label="Keep Typing"
        value={commentValue}
        onChange={e => setCommentValue(e.target.value)}
      />
    </DialogComponent>
  )
}

EditCommentDialog.propTypes = {
  editComment: PropTypes.object,
  handleCommentClose: PropTypes.func,
  editCommentHandler: PropTypes.func,
}
export default EditCommentDialog
