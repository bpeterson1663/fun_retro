import * as React from 'react'
import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Typography,
  TablePagination,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import useStyles from './AdminContainer.styles'
import { ActionItemTableProps, ActionItemType, Order } from '../../constants/types.constants'
import { deleteActionItem, editActionItemById } from '../../api/index'
import EditActionItemDialog from './Dialogs/EditActionItemDialog'
import EditIcon from '@material-ui/icons/Edit'
import SnackBar from '../Common/SnackBar'
import { getComparator, stableSort } from '../Common/Table/helpers'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)
import Checkbox from '@material-ui/core/Checkbox'

const ActionItemList: React.FC<ActionItemTableProps> = ({ name, data, retros, teams, tableUpdated }): JSX.Element => {
  const classes = useStyles()
  const [actionData, setActionData] = useState<ActionItemType[]>([])
  const [editItem, setEditItem] = useState<ActionItemType>({} as ActionItemType)
  const [editStatus, setEditStatus] = useState(false)
  const [response, setResponse] = useState({ open: false, status: '', message: '' })
  const [orderBy, setOrderBy] = useState<keyof ActionItemType>('value')
  const [order, setOrder] = useState<Order>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  useEffect(() => {
    const newData = data.map(d => {
      const retro = retros.find(retro => retro.id === d.retroId)?.name
      d.retroName = retro ? retro : ''
      return d
    })
    setActionData(newData)
  }, [data, retros])
  const handleDelete = (id: string) => deleteActionItem(id).then(tableUpdated)

  const editActionItem = (item: { value: string; teamId: string; owner: string, completed: boolean, completedDate: string }) => {
    const newItem = {
      ...editItem,
      ...item,
      timestamp: editItem.timestamp ? editItem.timestamp : dayjs().valueOf(),
    }
    editActionItemById(newItem.id, newItem).then(() => {
      handleEditActionClose()
      tableUpdated()
      if(item.completed){
        setResponse({ open: true, status: 'success', message: 'Action item completed! Keep up the good work!' })
      }
    }).catch(err => setResponse({ open: true, status: 'error', message: `Oh no! An error occured: ${err.message}` }))
  }

  const handleEditItem = (item: ActionItemType) => {
    setEditItem(item)
    setEditStatus(true)
  }
  const handleEditActionClose = () => {
    setEditStatus(false)
    setEditItem({} as ActionItemType)
  }
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ActionItemType) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const createSortHandler = (property: keyof ActionItemType) => (event: React.MouseEvent<unknown>) => {
    handleRequestSort(event, property)
  }
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const sortableHeaders: { name: string; id: keyof ActionItemType }[] = [
    { name: 'Action', id: 'value' },
    { name: 'Completed', id: 'completed' },
    { name: 'Completed Date', id: 'completedDate' },
    { name: 'Retro', id: 'retroName' },
    { name: 'Owner', id: 'owner' },
    { name: 'Created', id: 'timestamp' },
  ]

  const SortableHeadRow = (): JSX.Element => {
    return (
      <TableRow>
        {sortableHeaders.map(head => (
          <TableCell key={head.id}>
            <TableSortLabel
              active={orderBy === head.id}
              direction={orderBy === head.id ? order : 'asc'}
              onClick={createSortHandler(head.id)}
            >
              {head.name}
              {orderBy === head.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Edit</TableCell>
        <TableCell>Delete</TableCell>
      </TableRow>
    )
  }
  return (
    <TableContainer component={Paper} className={classes.actionTable}>
      <Typography variant="h6" align="center">
        {name}
      </Typography>
      <Table aria-label="manage action items" size="small">
        <TableHead>
          <SortableHeadRow />
        </TableHead>
        <TableBody>
          {stableSort(actionData, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(item => (
              <TableRow key={item.id} className={classes.actionRow}>
                <TableCell>{item.value}</TableCell>
                <TableCell>
                  <Checkbox
                    disabled
                    checked={item.completed ? true : false}
                    inputProps={{ 'aria-label': 'completed' }}
                  />
                </TableCell>
                <TableCell>{item.completedDate}</TableCell>
                <TableCell>{retros.find(retro => retro.id === item.retroId)?.name}</TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell>{dayjs(item.timestamp).format('L')}</TableCell>
                <TableCell>
                  <IconButton className={classes.icon} onClick={() => handleEditItem(item)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton edge="end" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {editStatus ? (
        <EditActionItemDialog
          teams={teams}
          item={editItem}
          editActionItem={editActionItem}
          editStatus={editStatus}
          handleEditActionClose={handleEditActionClose}
        />
      ) : null}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        count={actionData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <SnackBar
        open={response.open}
        message={response.message}
        status={response.status}
        onClose={() => setResponse({ open: false, message: '', status: '' })}
      />
    </TableContainer>
  )
}
ActionItemList.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  retros: PropTypes.array.isRequired,
  teams: PropTypes.array.isRequired,
  tableUpdated: PropTypes.func.isRequired,
}
export default ActionItemList
