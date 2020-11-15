import React, { useReducer, useEffect, useState, useContext } from 'react'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import _ from 'lodash'
import moment from 'moment'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import EditIcon from '@material-ui/icons/Edit'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import CreateRetroDialog from './Dialogs/CreateRetroDialog'
import EditRetroDialog from './Dialogs/EditRetroDialog'
import ShowLinkDialog from './Dialogs/ShowLinkDialog'
import SnackBar from '../Common/SnackBar'
import useStyles from './AdminContainer.styles'
import { getColumnsTitle } from '../../constants/columns.constants'

//TODO: Move Dialog into a common component
const AdminContainer = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [editStatus, setEditStatus] = useState(false)
  const [createStatus, setCreateStatus] = useState(false)
  const [editRetro, setEditRetro] = useState({})
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [retroIdToDelete, setRetroIdToDelete] = useState('')
  const [retroLink, setRetroLink] = useState({})
  const [showLinkStatus, setShowLinkStatus] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const columnMaps = [
    { title: 'Keep Doing', value: 'keepDoing', backgroundColor: '#009588' },
    { title: 'Stop Doing', value: 'stopDoing', backgroundColor: '#E91D63' },
    { title: 'Start Doing', value: 'startDoing', backgroundColor: '#9C28B0' },
  ]
  const auth = useContext(AuthContext)
  const classes = useStyles()
  const itemListReducer = (state, action) => {
    const newState = action.payload
    const itemIndex = state.findIndex(item => item.id === action.payload.id)
    setIsLoading(false)
    switch (action.type) {
      case 'ADD':
        setMessageState({
          displayMessage: true,
          message: `Way to go! You just created a Super Fun Retro!`,
          messageStatus: 'success',
        })
        return [newState].concat(state)
      case 'UPDATE':
        setMessageState({
          displayMessage: true,
          message: `Oh yea! Way to make those changes!`,
          messageStatus: 'success',
        })
        state[itemIndex] = action.payload
        return state
      case 'SET':
        return action.payload
      case 'REMOVE':
        setMessageState({
          displayMessage: true,
          message: 'Goodbye Retro! You have been deleted!',
          messageStatus: 'success',
        })
        return state.filter(item => item.id !== action.payload)
      default:
        return state
    }
  }

  const [retroList, dispatch] = useReducer(itemListReducer, [])

  useEffect(() => {
    db.collection('retros')
      .where('userId', '==', auth.userId)
      .get()
      .then(querySnapshot => {
        dispatch({
          type: 'SET',
          payload: querySnapshot.docs
            .map(doc => {
              const data = doc.data()
              data.id = doc.id
              return data
            })
            .sort((a, b) => {
              return b.timestamp - a.timestamp
            }),
        })
      })
  }, [auth.userId])

  const onSubmitHandler = retro => {
    setIsLoading(true)
    db.collection('retros')
      .add({
        name: retro.name,
        startDate: retro.startDate,
        endDate: retro.endDate,
        userId: auth.userId,
        numberOfVotes: retro.numberOfVotes,
        columnsKey: retro.columnsKey,
        isActive: true,
        previousRetro: retro.previousRetro,
        timestamp: new moment().valueOf(),
      })
      .then(res => {
        dispatch({
          type: 'ADD',
          payload: {
            name: retro.name,
            endDate: retro.endDate,
            startDate: retro.startDate,
            numberOfVotes: retro.numberOfVotes,
            columnsKey: retro.columnsKey,
            previousRetro: retro.previousRetro,
            id: res.id,
          },
        })
      })
  }

  const handleConfirmOpen = id => {
    setRetroIdToDelete(id)
    setConfirmDialogOpen(true)
  }

  const handleConfirmClose = () => {
    setRetroIdToDelete('')
    setConfirmDialogOpen(false)
  }

  const handleCreateOpen = () => {
    setCreateStatus(true)
  }

  const handleCreateClose = () => {
    setCreateStatus(false)
  }

  const handleEditClose = () => {
    setEditStatus(false)
  }

  const handleShowLink = retro => {
    setShowLinkStatus(true)
    setRetroLink(retro)
  }

  const handleShowLinkClose = () => {
    setShowLinkStatus(false)
    setRetroLink('')
  }

  const handleRetroDelete = id => {
    setIsLoading(true)
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', id)
        .get()
    })

    Promise.all(promises).then(res => {
      const batchDeletes = db.batch()
      _.each(res, querySnapshot => {
        _.each(querySnapshot.docs, doc => {
          batchDeletes.delete(doc.ref)
        })
      })
      batchDeletes.commit().then(() => {
        db.collection('retros')
          .doc(id)
          .delete()
          .then(() => {
            handleConfirmClose()
            dispatch({ type: 'REMOVE', payload: id })
          })
      })
    })
  }

  const handleEditItem = retro => {
    setEditStatus(true)
    setEditRetro(retro)
  }

  const handleUpdateRetro = retro => {
    setIsLoading(true)
    db.collection('retros')
      .doc(retro.id)
      .update(retro)
      .then(() => {
        setEditRetro({})
        setEditStatus(false)
        dispatch({
          type: 'UPDATE',
          payload: retro,
        })
      })
      .finally(() => setIsLoading(false))
  }

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const RetroData = () => {
    return (
      <div>
        <Typography variant="h5">Retro List</Typography>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={retroList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <TableContainer className={classes.tableContainer} component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Link</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {retroList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(retro => (
                <TableRow key={retro.id}>
                  <TableCell className={classes.nameCell}>{retro.name}</TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined" color="secondary" onClick={() => handleShowLink(retro)}>
                      Show Link
                    </Button>
                  </TableCell>
                  <TableCell>{getColumnsTitle(retro.columnsKey)}</TableCell>
                  <TableCell>{moment(retro.startDate).format('L')}</TableCell>
                  <TableCell>{moment(retro.endDate).format('L')}</TableCell>
                  <TableCell>
                    <IconButton className={classes.icon} onClick={handleEditItem.bind(this, retro)}>
                      <EditIcon disabled={isLoading} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.icon} onClick={handleConfirmOpen.bind(this, retro.id)}>
                      <DeleteIcon disabled={isLoading} data-testid="admin_delete-retro-button">
                        Delete
                      </DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    )
  }
  return (
    <Container data-testid="admin_container">
      <div className={classes.actionButtons}>
        <Button data-testid="admin_create-retro" onClick={handleCreateOpen} variant="contained" color="secondary">
          Create New Retro
        </Button>
      </div>

      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Grid container justify="center" spacing={0}>
        {retroList.length > 0 ? <RetroData /> : null}
      </Grid>

      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          close={handleMessageClose}
        />
      ) : null}
      <Dialog
        data-testid="delete-warning_dialog"
        open={confirmDialogOpen}
        onClose={handleConfirmClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete Retro?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to say goodbye to this retro and delete it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="confirm-delete_button"
            onClick={handleRetroDelete.bind(this, retroIdToDelete)}
            color="secondary"
            variant="contained"
          >
            Delete It!
          </Button>
          <Button
            data-testid="cancel-delete_button"
            onClick={handleConfirmClose.bind(this)}
            color="primary"
            variant="contained"
            autoFocus
          >
            No, Keep it.
          </Button>
        </DialogActions>
      </Dialog>
      <EditRetroDialog
        retro={editRetro}
        updateRetro={handleUpdateRetro}
        editStatus={editStatus}
        handleEditClose={handleEditClose}
        currentRetros={retroList}
      />
      <CreateRetroDialog
        submitRetro={onSubmitHandler}
        createStatus={createStatus}
        handleCreateClose={handleCreateClose}
        currentRetros={retroList}
      />
      <ShowLinkDialog showLinkStatus={showLinkStatus} handleShowLinkClose={handleShowLinkClose} retroLink={retroLink} />
    </Container>
  )
}

export default AdminContainer
