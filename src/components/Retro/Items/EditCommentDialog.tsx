import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'

interface EditCommentT{
  editComment: {
    originalComment: string,
    item: string,
    i: string
  },
  handleCommentClose: () => void
  editCommentHandler: (commentValue: string, originalComment: string, item: string, i: string) => void
}
const EditCommentDialog: React.FC<EditCommentT> = (props): JSX.Element => {
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

  const onSubmitHandler = (event: React.FormEvent) => {
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
        data-testid="edit-comment"
        rows="3"
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
  editComment: PropTypes.shape({
    originalComment: PropTypes.string.isRequired,
    item: PropTypes.string.isRequired,
    i: PropTypes.string.isRequired
  }).isRequired,
  handleCommentClose: PropTypes.func.isRequired,
  editCommentHandler: PropTypes.func.isRequired,
}
export default EditCommentDialog
