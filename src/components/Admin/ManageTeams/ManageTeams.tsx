import * as React from 'react'
import { useState, useContext, useEffect } from 'react'
import { deleteTeam, getTeams, createTeam, editTeamById } from '../../../api/index'
import DialogComponent from '../../Common/DialogComponent'
import ManageTeamsForm from './ManageTeamsForm'
import {
  Container,
  LinearProgress,
  IconButton,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import Typography from '@material-ui/core/Typography/Typography'
import EditIcon from '@material-ui/icons/Edit'
import AuthContext from '../../../context/auth-context'
import SnackBar from '../../Common/SnackBar'
import useStyles from '../AdminContainer.styles'
import { ManageTeamsType, Order } from '../../../constants/types.constants'
import { getComparator, stableSort } from '../../Common/Table/helpers'
import EditTeamDialog from '../Dialogs/EditTeamDialog'

const ManageTeams: React.FC = (): JSX.Element => {
  const auth = useContext(AuthContext)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [teamIdToDelete, setTeamIdToDelete] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState({ open: false, status: '', message: '' })
  const classes = useStyles()
  const [allTeams, setAllTeams] = useState<ManageTeamsType[]>([])
  const [editStatus, setEditStatus] = useState(false)
  const [editTeam, setEditTeam] = useState<ManageTeamsType | null>(null)
  const [orderBy, setOrderBy] = useState<keyof ManageTeamsType>('teamName')
  const [order, setOrder] = useState<Order>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  useEffect(() => {
    getTeams(auth.userId).then(querySnapshot => {
      const teams: ManageTeamsType[] = []

      querySnapshot.docs.forEach(doc => {
        const docData = doc.data()
        teams.push({
          id: doc.id,
          teamName: docData.teamName,
          timestamp: docData.timestamp,
          userId: auth.userId,
          emailList: docData.emailList ? docData.emailList : [],
        })
      })
      setAllTeams(teams)
    })
  }, [auth.userId])
  const handleConfirmClose = (): void => {
    setTeamIdToDelete('')
    setConfirmDialogOpen(false)
  }
  const handleConfirmOpen = (id: string): void => {
    setTeamIdToDelete(id)
    setConfirmDialogOpen(true)
  }

  const handleEditClose = () => {
    setEditStatus(false)
    setEditTeam(null)
  }

  const handleEditOpen = (team: ManageTeamsType) => {
    setEditTeam(team)
    setEditStatus(true)
  }

  const onSubmitHandler = (data: ManageTeamsType) => {
    setIsLoading(true)
    createTeam(data)
      .then(res => {
        data.id = res.id
        const newState = allTeams
        newState.push(data)
        setAllTeams(newState)
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'success',
          message: 'Team was created successfully!',
        })
      })
      .catch(err => {
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'error',
          message: 'Oh no, something went wrong!',
        })
        console.error(err)
      })
  }
  const handleEditSubmit = (team: ManageTeamsType): void => {
    setIsLoading(true)
    editTeamById(team.id, team)
      .then(() => {
        setIsLoading(false)
        const newState = allTeams
        const itemIndex = allTeams.findIndex(item => item.id === team.id)
        newState[itemIndex] = team
        setAllTeams(newState)
        setResponse({
          open: true,
          status: 'success',
          message: 'That team was updated!',
        })
      })
      .catch(err => {
        setIsLoading(false)
        setResponse({
          open: true,
          status: 'error',
          message: 'Oh no something went wrong!',
        })
        console.error(err)
      })
  }
  const handleTeamDelete = (id: string): void => {
    setIsLoading(true)
    deleteTeam(id)
      .then(() => {
        const newState = allTeams.filter(team => team.id !== id)
        setAllTeams(newState)
        setIsLoading(false)
        handleConfirmClose()
        setResponse({
          open: true,
          status: 'success',
          message: 'Team was deleted successfully!',
        })
      })
      .catch(err => {
        setIsLoading(false)
        handleConfirmClose()
        setResponse({
          open: true,
          status: 'error',
          message: 'Oh no, there was an error!',
        })
        console.error('ERROR: ', err)
      })
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ManageTeamsType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const createSortHandler = (property: keyof ManageTeamsType) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }
  const TeamListData: React.FC = (): JSX.Element => {
    return (
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table aria-label="manage teams table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'teamName'}
                  direction={orderBy === 'teamName' ? order : 'asc'}
                  onClick={createSortHandler('teamName')}
                >
                  Name
                  {orderBy === 'teamName' ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Email(s)</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(allTeams, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(team => (
                <TableRow key={team.id} className={classes.actionRow}>
                  <TableCell>{team.teamName}</TableCell>
                  <TableCell>
                    <ul>
                      {team.emailList.map(item => (
                        <li key={item.email + (Math.random() * 10000).toFixed(0)}>{item.email}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.icon} onClick={() => handleEditOpen(team)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.icon} onClick={() => handleConfirmOpen(team.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={allTeams.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
    )
  }

  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Manage Teams</Typography>
      <ManageTeamsForm handleSubmit={onSubmitHandler} />
      <SnackBar
        open={response.open}
        message={response.message}
        status={response.status}
        onClose={() => setResponse({ open: false, message: '', status: '' })}
      />
      <Grid container justify="center" spacing={0}>
        {allTeams.length > 0 ? <TeamListData /> : null}
      </Grid>
      {confirmDialogOpen ? (
        <DialogComponent
          open={confirmDialogOpen}
          onClose={handleConfirmClose}
          title="Delete Team?"
          actions={[
            <Button
              key={0}
              data-testid="confirm-delete_button"
              onClick={() => handleTeamDelete(teamIdToDelete)}
              color="secondary"
              variant="contained"
            >
              Delete It!
            </Button>,
            <Button
              key={1}
              data-testid="cancel-delete_button"
              onClick={handleConfirmClose}
              color="primary"
              variant="contained"
              autoFocus
            >
              No, Keep it.
            </Button>,
          ]}
        >
          Are you sure you want to say goodbye to this team and delete it?
        </DialogComponent>
      ) : null}
      {editTeam ? (
        <EditTeamDialog
          handleEditSubmit={handleEditSubmit}
          editTeam={editTeam}
          editStatus={editStatus}
          handleEditClose={handleEditClose}
        />
      ) : null}
    </Container>
  )
}

export default ManageTeams
