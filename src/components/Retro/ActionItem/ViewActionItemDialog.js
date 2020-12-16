import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import useStyles from '../Retro.styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'

const ViewActionItemDialog = props => {
  const { showViewActionDialog, handleViewActionDialogClose, retroName, retroId, team } = props
  const classes = useStyles()
  const [actionItems, setActionItems] = useState({})
  const [editItem, setEditItem] = useState('')
  const [newEdit, setNewEdit] = useState('')

  useEffect(() => {
    const actionItemMap = []
    if (team.length > 0) {
      const promises = team.map(t => {
        actionItemMap.push({ id: t.id, name: t.teamName, actions: [] })
        return db
          .collection('actionItems')
          .where('teamId', '==', t.id)
          .get()
      })
      Promise.all(promises).then(res => {
        res.forEach(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            const data = doc.data()
            const map = actionItemMap.find(m => m.id === data.teamId)
            map.actions.push({
              ...data,
              id: doc.id,
            })
          })
        })
        setActionItems(actionItemMap)
      })
    } else {
      db.collection('actionItems')
        .where('retroId', '==', retroId)
        .get()
        .then(querySnapshot => {
          const docs = querySnapshot.docs.map(doc => {
            const data = doc.data()
            data.id = doc.id
            return data
          })
          setActionItems([{ id: retroId, name: retroName, actions: docs }])
        })
    }
  }, [retroId, showViewActionDialog, team, retroName])

  const handleEditItem = (id, value) => {
    setEditItem(id)
    setNewEdit(value)
  }

  const handleDelete = id => {
    db.collection('actionItems')
      .doc(id)
      .delete()
      .then(() => {
         const allMap = actionItems.map(m => {
           m.actions = m.actions.filter(action => action.id !== id) 
           return m
        })
        setActionItems(allMap)
      })
  }
  const resetEdit = () => {
    setEditItem('')
    setNewEdit('')
  }

  const handleSaveItem = item => {
    db.collection('actionItems')
      .doc(item.id)
      .update({
        ...item,
        value: newEdit,
      })
      .then(() => {
        let allMap = actionItems;
        allMap.forEach(m => {
          m.actions.forEach(action => {
            if(action.id === item.id) action.value = newEdit
          })
        })
        resetEdit()
        setActionItems(allMap)
      })
  }

  return (
    <Dialog data-testid="actionitem_dialog" open={showViewActionDialog} onClose={handleViewActionDialogClose}>
      <DialogTitle>
        <Typography>Action Items for {retroName} </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {actionItems.length > 0 ? (
          actionItems.map(item => (
            <div key={item.id}>
              <Typography>{item.name}</Typography>
              <List>
                {item.actions.map(item => (
                  <ListItem key={'ListItem' + item.id}>
                    <ListItemAvatar>
                      {editItem === item.id ? (
                        <IconButton onClick={() => handleSaveItem(item)}>
                          <SaveIcon />
                        </IconButton>
                      ) : (
                        <IconButton className={classes.icon} onClick={() => handleEditItem(item.id, item.value)}>
                          <EditIcon />
                        </IconButton>
                      )}
                    </ListItemAvatar>
                    {editItem === item.id ? (
                      <TextField
                        key={'TextField' + item.id}
                        name="edit_item"
                        style={{ width: 300 }}
                        required
                        className={`${classes.inputField} ${classes.inputFieldText}`}
                        type="text"
                        label="Action Item"
                        value={newEdit}
                        onChange={e => setNewEdit(e.target.value)}
                      />
                    ) : (
                      <ListItemText primary={item.value} />
                    )}

                    <ListItemSecondaryAction>
                      {editItem === item.id ? (
                        <IconButton onClick={resetEdit}>
                          <CancelIcon />
                        </IconButton>
                      ) : (
                        <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          ))
        ) : (
          <Typography>No action items...yet!</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleViewActionDialogClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ViewActionItemDialog.propTypes = {
  showViewActionDialog: PropTypes.bool,
  handleViewActionDialogClose: PropTypes.func,
  retroName: PropTypes.string,
  retroId: PropTypes.string,
  isAdmin: PropTypes.bool,
  team: PropTypes.array,
}
export default ViewActionItemDialog
