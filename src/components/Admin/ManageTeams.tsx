import * as React from 'react'
import { useState, useContext, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import dayjs from 'dayjs'
import { db } from '../../firebase'
import DialogComponent from '../Common/DialogComponent'
import {
  FormControl,
  Container,
  TextField,
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
import Autocomplete from '@material-ui/lab/Autocomplete'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import EditIcon from '@material-ui/icons/Edit'
import Typography from '@material-ui/core/Typography/Typography'
import AuthContext from '../../context/auth-context'
import SnackBar from '../Common/SnackBar'
import useStyles from './AdminContainer.styles'
import { ManageTeamsType, Order } from '../../constants/types.constant'
import { getComparator, stableSort } from '../Common/Table/helpers'

import EditTeamDialog from './Dialogs/EditTeamDialog'

const ManageTeams: React.FC = (): JSX.Element => {
  const auth = useContext(AuthContext)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [teamIdToDelete, setTeamIdToDelete] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState({ open: false, status: '', message: '' })
  const classes = useStyles()
  const [teamName, setTeamName] = useState('')
  const [allTeams, setAllTeams] = useState<ManageTeamsType[]>([])
  const [editStatus, setEditStatus] = useState(false)
  const [editTeam, setEditTeam] = useState<ManageTeamsType | null>(null)
  const [emailList, setEmailList] = useState<string[]>([])
  const [error, setError] = useState(false)
  const [orderBy, setOrderBy] = useState<keyof ManageTeamsType>('teamName')
  const [order, setOrder] = useState<Order>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  useEffect(() => {
    db.collection('teams')
      .where('userId', '==', auth.userId)
      .get()
      .then(querySnapshot => {
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
  const onSubmitHandler = () => {
    setIsLoading(true)
    const emailListMap = emailList.map(email => {
      return { email: email }
    })
    const newTeam = {
      teamName: teamName,
      emailList: emailListMap,
      timestamp: dayjs().valueOf(),
      userId: auth.userId,
    } as ManageTeamsType
    db.collection('teams')
      .add(newTeam)
      .then(res => {
        newTeam.id = res.id
        const newState = allTeams
        newState.push(newTeam)
        setAllTeams(newState)
        setTeamName('')
        setEmailList([])
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
    db.collection('teams')
      .doc(team.id)
      .update(team)
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
    db.collection('teams')
      .doc(id)
      .delete()
      .then(() => {
        const newState = allTeams.filter(team => team.id !== id)
        setAllTeams(newState)
        setIsLoading(false)
        handleConfirmClose()
        setResponse({
          open: true,
          status: 'success',
          message: 'Team was delete successfully!',
        })
      })
      .catch(err => {
        setIsLoading(false)
        handleConfirmClose()
        setResponse({
          open: true,
          status: 'error',
          message: 'Oh no there was an error!',
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
          rowsPerPageOptions={[5, 10, 20]}
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
  const validateEmail = (email: string) => {
    if (!email) {
      setError(false)
      return
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (re.test(String(email).toLowerCase())) {
      setError(false)
    } else {
      setError(true)
    }
  }

  const ErrorTypography = withStyles(theme => ({
    root: {
      color: theme.palette.error.dark,
      margin: '0 auto',
    },
  }))(Typography)

  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Manage Teams</Typography>
      <Grid className={classes.form}>
        <FormControl>
          <TextField
            className={`${classes.inputField} ${classes.inputFieldText}`}
            name="teamName"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            required
            type="text"
            label="Team Name"
          />
        </FormControl>
        <FormControl>
          <Autocomplete
            id="email"
            multiple
            freeSolo
            filterSelectedOptions
            className={`${classes.inputField} ${classes.inputFieldText}`}
            options={emailList}
            onChange={(e, option) => setEmailList(option)}
            onInputChange={(e, value) => validateEmail(value)}
            size="small"
            renderInput={params => <TextField {...params} error={error} label="Email(s)" />}
          />
          {error ? (
            <ErrorTypography variant="caption" display="block">
              Please enter a valid email
            </ErrorTypography>
          ) : null}
        </FormControl>
        <div className={classes.actionButtons}>
          <Button
            type="submit"
            color="secondary"
            onClick={onSubmitHandler}
            disabled={(error && emailList.length < 1) || !teamName}
            variant="contained"
          >
            Create Team
          </Button>
        </div>
      </Grid>
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
