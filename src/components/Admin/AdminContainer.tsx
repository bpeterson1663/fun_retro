import React, { useEffect, useState, useContext } from 'react'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import { getAllRetros } from '../../api/index'
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
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import ShowLinkDialog from './Dialogs/ShowLinkDialog'
import SnackBar from '../Common/SnackBar'
import useStyles from './AdminContainer.styles'
import { Link } from 'react-router-dom'
import { getComparator, stableSort } from '../Common/Table/helpers'
import { getColumnsTitle } from '../../constants/columns.constants'
import { Order, RetroType } from '../../constants/types.constant'

//TODO: Move Dialog into a common component
const AdminContainer = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [retroList, setRetroList] = useState<RetroType[]>([])
  const [retroToDelete, setRetroToDelete] = useState<RetroType>({} as RetroType)
  const [retroLink, setRetroLink] = useState<RetroType>({} as RetroType)
  const [showLinkStatus, setShowLinkStatus] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState<keyof RetroType>('name')
  const [order, setOrder] = useState<Order>('asc')
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

  useEffect(() => {
    getAllRetros(auth.userId).then(querySnapshot => {
      const payload: RetroType[] = []
      querySnapshot.docs.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        data.team = data.team ? data.team : []
        payload.push(data as RetroType)
      })
      payload.sort((a, b) => {
        return b.timestamp - a.timestamp
      })
      setRetroList(payload)
      setIsLoading(false)
    })
  }, [auth.userId])

  const handleConfirmOpen = (retro: RetroType) => {
    setRetroToDelete(retro)
    setConfirmDialogOpen(true)
  }

  const handleConfirmClose = () => {
    setRetroToDelete({} as RetroType)
    setConfirmDialogOpen(false)
  }

  const handleShowLink = (retro: RetroType) => {
    setShowLinkStatus(true)
    setRetroLink(retro)
  }

  const handleShowLinkClose = () => {
    setShowLinkStatus(false)
    setRetroLink({} as RetroType)
  }

  const handleRetroDelete = (retro: RetroType) => {
    setIsLoading(true)
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', retro.id)
        .get()
    })

    Promise.all(promises).then(res => {
      const batchDeletes = db.batch()
      res.forEach(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          batchDeletes.delete(doc.ref)
        })
      })
      batchDeletes.commit().then(() => {
        db.collection('retros')
          .doc(retro.id)
          .delete()
          .then(() => {
            handleConfirmClose()
            setMessageState({
              displayMessage: true,
              message: 'Goodbye Retro! You have been deleted!',
              messageStatus: 'success',
            })
            setIsLoading(false)
          })
      })
    })
  }

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof RetroType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const createSortHandler = (property: keyof RetroType) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }
  const RetroData = () => {
    return (
      <div>
        <Typography variant="h5">Retro List</Typography>
        <div className={classes.actionButtons}>
          <Link to="/createRetro" style={{ textDecoration: 'none' }}>
            <Button color="secondary" variant="contained">
              Create Retro
            </Button>
          </Link>
        </div>
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
          <Table aria-label="retro list table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={createSortHandler('name')}
                  >
                    Name
                    {orderBy === 'name' ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Link</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'columnsKey'}
                    direction={orderBy === 'columnsKey' ? order : 'asc'}
                    onClick={createSortHandler('columnsKey')}
                  >
                    Type
                    {orderBy === 'columnsKey' ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Team(s)</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'startDate'}
                    direction={orderBy === 'startDate' ? order : 'asc'}
                    onClick={createSortHandler('startDate')}
                  >
                    Start Date
                    {orderBy === 'startDate' ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={orderBy === 'endDate'}
                    direction={orderBy === 'endDate' ? order : 'asc'}
                    onClick={createSortHandler('endDate')}
                  >
                    End Date
                    {orderBy === 'endDate' ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(retroList, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(retro => (
                  <TableRow key={retro.id}>
                    <TableCell>{retro.name}</TableCell>
                    <TableCell align="center">
                      <Button
                        className={classes.showLinkButton}
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleShowLink(retro)}
                      >
                        Show Link
                      </Button>
                    </TableCell>
                    <TableCell>{getColumnsTitle(retro.columnsKey)}</TableCell>
                    <TableCell>
                      <ul>
                        {retro.team.map(item => (
                          <li key={item.id}>{item.teamName}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{moment(retro.startDate).format('L')}</TableCell>
                    <TableCell>{moment(retro.endDate).format('L')}</TableCell>
                    <TableCell>
                      <Link to={`/editRetro/${retro.id}`}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        disabled={isLoading}
                        className={classes.icon}
                        onClick={handleConfirmOpen.bind(this, retro)}
                      >
                        <DeleteIcon />
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
            onClick={handleRetroDelete.bind(this, retroToDelete)}
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
      <ShowLinkDialog showLinkStatus={showLinkStatus} handleShowLinkClose={handleShowLinkClose} retroLink={retroLink} />
    </Container>
  )
}

export default AdminContainer
