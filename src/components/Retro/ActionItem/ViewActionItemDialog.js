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
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import Button from '@material-ui/core/Button'

const ViewActionItemDialog = props => {
  const { showViewActionDialog, handleViewActionDialogClose, retroName, retroId, isAdmin } = props
  const classes = useStyles()
  const [actionItems, setActionItems] = useState([])
  const [editItem, setEditItem] = useState('')
  const [newEdit, setNewEdit] = useState('')

  useEffect(() => {
    db.collection('actionItems')
      .where('retroId', '==', retroId)
      .get()
      .then(querySnapshot => {
        const docs = querySnapshot.docs.map(doc => {
          const data = doc.data()
          data.id = doc.id
          return data
        })
        setActionItems(docs)
      })
  }, [retroId, showViewActionDialog])

  const handleEditItem = (id, value) => {
    setEditItem(id)
    setNewEdit(value)
  }

  const handleDelete = id => {
    db.collection('actionItems')
      .doc(id)
      .delete()
      .then(() => {
        const newActionItems = actionItems.filter(item => item.id !== id)
        setActionItems(newActionItems)
      })
  }
  const resetEdit = () => {
    setEditItem('')
    setNewEdit('')
  }

  const handleSaveItem = id => {
    db.collection('actionItems')
      .doc(id)
      .update({
        value: newEdit,
      })
      .then(() => {
        const newActionItems = actionItems.map(item => {
          if (item.id === id) item.value = newEdit
          return item
        })
        resetEdit()
        setActionItems(newActionItems)
      })
  }

  const AdminActionsTable = () => {
    return (
      <TableBody>
        {actionItems.map(item => {
          return (
            <TableRow key={item.id}>
              <TableCell>
                {editItem === item.id ? (
                  <TextField
                    name="edit_item"
                    required
                    className={`${classes.inputField} ${classes.inputFieldText}`}
                    type="text"
                    label="Action Item"
                    value={newEdit}
                    onChange={e => setNewEdit(e.target.value)}
                  />
                ) : (
                  item.value
                )}
              </TableCell>
              <TableCell>
                {editItem === item.id ? (
                  <IconButton onClick={() => handleSaveItem(item.id)}>
                    <SaveIcon />
                  </IconButton>
                ) : (
                  <IconButton className={classes.icon} onClick={() => handleEditItem(item.id, item.value)}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
              <TableCell>
                {editItem === item.id ? (
                  <IconButton onClick={resetEdit}>
                    <CancelIcon />
                  </IconButton>
                ) : (
                  <IconButton className={classes.icon} onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }
  const UserActionsTable = () => {
    return (
      <TableBody>
        {actionItems.map(item => {
          return (
            <TableRow key={item.id}>
              <TableCell>{item.value}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  }
  return (
    <Dialog data-testid="actionitem_dialog" open={showViewActionDialog} onClose={handleViewActionDialogClose}>
      <DialogTitle>
        <Typography>Action Items for {retroName} </Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <TableContainer>
          {actionItems.length > 0 ? (
            <Table>{isAdmin ? <AdminActionsTable /> : <UserActionsTable />}</Table>
          ) : (
            <Typography>No action items...yet!</Typography>
          )}
        </TableContainer>
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
}
export default ViewActionItemDialog
