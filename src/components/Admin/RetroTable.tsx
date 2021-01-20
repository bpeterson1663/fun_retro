import * as React from 'react'
import { useState } from 'react'

import useStyles from './AdminContainer.styles'
import PropTypes from 'prop-types'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import { getComparator, stableSort } from '../Common/Table/helpers'
import { getColumnsTitle } from '../../constants/columns.constants'
import { Order, RetroType, RetroTypeString } from '../../constants/types.constant'
import Typography from '@material-ui/core/Typography/Typography'
import ShowLinkDialog from './Dialogs/ShowLinkDialog'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

interface RetroTableProps {
  data: RetroTypeString[]
  name: string
  handleDelete: (retro: RetroType) => void
}

const RetroTable: React.FC<RetroTableProps> = ({ data, name, handleDelete }): JSX.Element => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [orderBy, setOrderBy] = useState<keyof RetroType>('name')
  const [order, setOrder] = useState<Order>('asc')
  const classes = useStyles()
  const [retroLink, setRetroLink] = useState<RetroType>({} as RetroType)
  const [showLinkStatus, setShowLinkStatus] = useState(false)

  const handleShowLinkClose = () => {
    setShowLinkStatus(false)
    setRetroLink({} as RetroType)
  }
  const handleShowLink = (retro: RetroType) => {
    setShowLinkStatus(true)
    setRetroLink(retro)
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

  return (
    <TableContainer component={Paper} className={classes.actionTable}>
      <Typography variant="h6" align="center">
        {name}
      </Typography>
      <Table aria-label="manage action items" size="small">
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
          {stableSort(data, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(retro => (
              <TableRow key={retro.id} className={classes.actionRow}>
                <TableCell>{retro.name}</TableCell>
                <TableCell align="center">
                  <Button
                    className={classes.showLinkButton}
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => handleShowLink(retro as RetroType)}
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
                <TableCell>{dayjs(retro.startDate).format('L')}</TableCell>
                <TableCell>{dayjs(retro.endDate).format('L')}</TableCell>
                <TableCell>
                  <Link to={`/editRetro/${retro.id}`}>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </Link>
                </TableCell>
                <TableCell>
                  <IconButton className={classes.icon} onClick={handleDelete.bind(this, retro as RetroType)}>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      {showLinkStatus ? (
        <ShowLinkDialog
          showLinkStatus={showLinkStatus}
          handleShowLinkClose={handleShowLinkClose}
          retroLink={retroLink}
        />
      ) : null}
    </TableContainer>
  )
}
RetroTable.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
}
export default RetroTable
