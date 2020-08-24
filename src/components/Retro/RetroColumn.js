import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { db, incrementCounter, decrementCounter } from '../../firebase'
import AuthContext from '../../context/auth-context'
import VoteContext from '../../context/vote-context'
import _ from 'lodash'
import moment from 'moment'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import ThumbUp from '@material-ui/icons/ThumbUp'
import Typography from '@material-ui/core/Typography/Typography'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Avatar from '@material-ui/core/Avatar'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import CommentIcon from '@material-ui/icons/Comment'
import CreateItem from './Items/CreateItem'
import CommentItemDialog from './Items/CommentItemDialog'
import EditCommentDialog from './Items/EditCommentDialog'
import useStyles from './Retro.styles'
import { columnKeys } from '../../constants/columns.constants'

const RetroColumn = props => {
  const { columnName, retroId, votesPerPerson, columnsKey } = props
  const [itemList, setItemList] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [itemEdit, setItemEdit] = useState({})
  const [showCommentDialog, setShowCommentDialog] = useState({})
  const [editCommentValue, setEditCommentValue] = useState({})
  const auth = useContext(AuthContext)
  const vote = useContext(VoteContext)
  const classes = useStyles()
  const columnMaps = columnsKey ? columnKeys[columnsKey] : columnKeys['keepDoing']

  const init = () => {
    const unsubscribe = db
      .collection(columnName)
      .where('retroId', '==', retroId)
      .onSnapshot(querySnapshot => {
        _.each(querySnapshot.docChanges(), change => {
          if (change.type === 'removed') {
            getUserVoteStatus()
          }
        })
        const columnData = querySnapshot.docs
          .map(doc => {
            const data = doc.data()
            data.id = doc.id
            if (!data.voteMap) {
              data.voteMap = []
            }
            if (!data.comments) {
              data.comments = []
            }
            return data
          })
          .sort((a, b) => {
            return a.timestamp - b.timestamp
          })
        setItemList(columnData)
        setLoading(false)
      })
    return () => unsubscribe()
  }
  const getUserVoteStatus = () => {
    //Get Current Users votes for all columns
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', retroId)
        .get()
    })
    let allVotes = []
    Promise.all(promises).then(res => {
      _.each(res, querySnapshot => {
        _.each(querySnapshot.docs, doc => {
          const data = doc.data()
          allVotes = allVotes.concat(data.voteMap)
        })
      })
      const userVoteCount = _.filter(allVotes, id => id === auth.userId).length
      vote.setRemainingVotes(votesPerPerson - userVoteCount)
    })
  }
  useEffect(init, [votesPerPerson])

  const handleItemSubmit = value => {
    setLoading(true)
    db.collection(columnName)
      .add({
        value: value,
        retroId: retroId,
        userId: auth.userId,
        votes: 0,
        voteMap: [],
        timestamp: new moment().valueOf(),
        comments: [],
      })
      .finally(() => setLoading(false))
  }

  const handleItemVote = (operation, item) => {
    const itemRef = db.collection(columnName).doc(item.id)
    if (operation === 'addVote') {
      if (item.voteMap) {
        item.voteMap.push(auth.userId)
      } else {
        item.voteMap = [auth.userId]
      }
      itemRef.update({ votes: incrementCounter, voteMap: item.voteMap })
      vote.setRemainingVotes(--vote.votes)
    } else {
      if (item.voteMap) {
        item.voteMap.splice(item.voteMap.indexOf(auth.userId), 1)
      } else {
        item.voteMap = []
      }
      itemRef.update({ votes: decrementCounter, voteMap: item.voteMap })
      vote.setRemainingVotes(++vote.votes)
    }
  }

  const handleItemDelete = id => {
    setLoading(true)
    db.collection(columnName)
      .doc(id)
      .delete()
      .finally(() => setLoading(false))
  }

  const handleEditItem = item => {
    setEditMode(true)
    setItemEdit(item)
  }

  const resetEditMode = () => {
    setEditMode(false)
    setItemEdit({})
  }

  const handleUpdateItem = () => {
    setLoading(true)
    db.collection(columnName)
      .doc(itemEdit.id)
      .update({
        value: itemEdit.value,
      })
      .then(() => resetEditMode())
      .finally(() => setLoading(false))
  }

  const getUsersVoteCount = item => {
    return _.filter(item.voteMap, id => auth.userId === id).length
  }

  const disableDeleteVotes = item => {
    return vote.votes === votesPerPerson || getUsersVoteCount(item) === 0
  }

  const showRemoveVote = item => {
    return getUsersVoteCount(item) > 0
  }

  const handleCommentClose = () => {
    setShowCommentDialog({})
    setEditCommentValue({})
  }

  const handleAddComment = (val, item) => {
    setLoading(true)
    item.comments.push({ value: val, userId: auth.userId })
    db.collection(columnName)
      .doc(item.id)
      .update({
        comments: item.comments,
      })
      .then(() => handleCommentClose())
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleCommentDelete = (comment, item) => {
    setLoading(true)
    const newComments = item.comments.filter(function(obj) {
      return obj !== comment
    })
    db.collection(columnName)
      .doc(item.id)
      .update({
        comments: newComments,
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const handleEditComment = (comment, originalComment, item, i) => {
    setLoading(true)
    const newComments = item.comments.map((obj, index) => {
      if (obj.value === originalComment && index === i) {
        obj.value = comment
      }
      return obj
    })
    db.collection(columnName)
      .doc(item.id)
      .update({
        comments: newComments,
      })
      .then(() => handleCommentClose())
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  return (
    <Container style={{ padding: '8px' }} data-testid={`column-${columnName}`}>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
      <Typography variant="h6" className={classes.header}>
        {props.title}
      </Typography>
      <CreateItem columnName={columnName} isActive={props.isActive} itemSubmit={handleItemSubmit} />
      {itemList.map((item, i) => {
        return (
          <Card data-testid={`column-${columnName}-item${i}`} key={i} className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              avatar={<Avatar data-testid={`column-${columnName}-voteTotal${i}`} className={classes.avatar}>{item.votes}</Avatar>}
            />
            <CardContent className={classes.cardConent}>
              {editMode && itemEdit.id === item.id ? (
                <TextField
                  data-testid={`column-${columnName}-edit-textfield`}
                  variant="outlined"
                  multiline
                  rows="3"
                  maxLength="1000"
                  className={classes.editTextBox}
                  value={itemEdit.value}
                  onChange={e => setItemEdit({ ...itemEdit, value: e.target.value })}
                />
              ) : (
                <Typography variant="body1">{item.value}</Typography>
              )}
              {item.comments.length > 0
                ? item.comments.map((comment, i) => {
                    return (
                      <div className={classes.commentContainer} key={i}>
                        <Typography data-testid={`column-${columnName}-coment${i}`} className={classes.comment} variant="body2">
                          {comment.value}
                        </Typography>
                        {comment.userId === auth.userId ? (
                          <div>
                            <IconButton data-testid={`column-${columnName}-deleteComment${i}`} disabled={!props.isActive} onClick={() => handleCommentDelete(comment, item)}>
                              <DeleteIcon />
                            </IconButton>
                            <IconButton
                              disabled={!props.isActive}
                              data-testid={`column-${columnName}-editComment${i}`}
                              onClick={() =>
                                setEditCommentValue({
                                  i,
                                  item: item,
                                  originalComment: comment.value,
                                })
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </div>
                        ) : null}
                      </div>
                    )
                  })
                : null}
            </CardContent>
            <CardActions className={classes.cardAction}>
              <div className={classes.voteContainer}>
                <Avatar data-testid={`column-${columnName}-itemUserVote${i}`} className={classes.votes}>{getUsersVoteCount(item)}</Avatar>
                <IconButton
                  disabled={vote.votes === 0 || !props.isActive}
                  onClick={handleItemVote.bind(this, 'addVote', item)}
                  data-testid={`column-${columnName}-likeItem${i}`}
                >
                  <ThumbUp />
                </IconButton>
                {showRemoveVote(item) ? (
                  <Button
                    data-testid={`column-${columnName}-removeVote${i}`}
                    className={classes.remove}
                    disabled={disableDeleteVotes(item) || !props.isActive}
                    onClick={handleItemVote.bind(this, 'removeVote', item)}
                    vairant="outlined"
                    size="small"
                  >
                    Remove Vote
                  </Button>
                ) : null}
                <IconButton data-testid={`column-${columnName}-comment${i}`} disabled={!props.isActive} onClick={() => setShowCommentDialog({ item: item })}>
                  <CommentIcon />
                </IconButton>
              </div>
              {auth.userId === item.userId ? (
                editMode && itemEdit.id === item.id ? (
                  <div className={classes.editContainer}>
                    <IconButton data-testid={`column-${columnName}-saveEdit${i}`} disabled={!props.isActive} onClick={handleUpdateItem.bind(this)}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton data-testid={`column-${columnName}-cancelEdit${i}`} disabled={!props.isActive} onClick={resetEditMode.bind(this, item)}>
                      <CancelIcon />
                    </IconButton>
                  </div>
                ) : (
                  <div className={classes.editContainer}>
                    <IconButton data-testid={`column-${columnName}-edit${i}`} disabled={!props.isActive} onClick={handleEditItem.bind(this, item)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton data-testid={`column-${columnName}-delete${i}`} disabled={!props.isActive} onClick={handleItemDelete.bind(this, item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
              ) : null}
            </CardActions>
          </Card>
        )
      })}
      <CommentItemDialog
        showCommentDialog={showCommentDialog}
        handleCommentClose={handleCommentClose}
        addComment={handleAddComment}
      />
      <EditCommentDialog
        handleCommentClose={handleCommentClose}
        editComment={editCommentValue}
        editCommentHandler={handleEditComment}
      />
    </Container>
  )
}

RetroColumn.propTypes = {
  columnName: PropTypes.string,
  isActive: PropTypes.bool,
  title: PropTypes.string,
  votesPerPerson: PropTypes.number,
  retroId: PropTypes.string,
  remaingVotes: PropTypes.number,
  columnsKey: PropTypes.string
}

export default RetroColumn
