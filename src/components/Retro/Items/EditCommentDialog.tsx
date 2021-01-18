import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import DialogComponent from '../../Common/DialogComponent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import useStyles from '../Retro.styles'
import { ItemT } from '../../../constants/types.constant'

interface EditCommentT {
  editComment: {
    originalComment: string
    item: ItemT
    i: number
  }
  handleCommentClose: () => void
  editCommentHandler: (commentValue: string, originalComment: string, item: ItemT, i: number) => void
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
    i: PropTypes.number.isRequired,
  }).isRequired,
  handleCommentClose: PropTypes.func.isRequired,
  editCommentHandler: PropTypes.func.isRequired,
}
export default EditCommentDialog
