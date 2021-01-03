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
import { ActionItemTableProps, ActionItemType, Order } from '../../constants/types.constant'
import { deleteActionItem, editActionItemById } from '../../api/index'
import EditActionItemDialog from './Dialogs/EditActionItemDialog'
import EditIcon from '@material-ui/icons/Edit'
import { getComparator, stableSort } from '../Common/Table/helpers'

const ActionItemList: React.FC<ActionItemTableProps> = ({ name, data, retros, teams, tableUpdated }): JSX.Element => {
  const classes = useStyles()
  const [actionData, setActionData] = useState<ActionItemType[]>([])
  const [isEmptyTable, setIsEmptyTable] = useState(false)
  const [editItem, setEditItem] = useState<ActionItemType>({} as ActionItemType)
  const [editStatus, setEditStatus] = useState(false)
  const [orderBy, setOrderBy] = useState<keyof ActionItemType>('retroId')
  const [order, setOrder] = useState<Order>('asc')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  useEffect(() => {
    const newData = data.map(d => {
      const retro = retros.find(retro => retro.id === d.retroId)?.name
      d.retroName = retro ? retro : ''
      return d
    })
    newData.length > 0 ? setActionData(newData) : setIsEmptyTable(true)
  }, [data, retros])
  const handleDelete = (id: string) => deleteActionItem(id).then(tableUpdated)

  const editActionItem = (item: { value: string; teamId: string; owner: string }) => {
    const newItem = {
      ...editItem,
      ...item,
    }
    editActionItemById(newItem.id, newItem).then(() => {
      handleEditActionClose()
      tableUpdated()
    })
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

  return isEmptyTable ? (
    <></>
  ) : (
    <TableContainer component={Paper} className={classes.actionTable}>
      <Typography variant="h6">{name}</Typography>
      <Table aria-label="manage action items" size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'value'}
                direction={orderBy === 'value' ? order : 'asc'}
                onClick={createSortHandler('value')}
              >
                Action
                {orderBy === 'value' ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'retroId'}
                direction={orderBy === 'retroId' ? order : 'asc'}
                onClick={createSortHandler('retroId')}
              >
                Retro
                {orderBy === 'retroId' ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'owner'}
                direction={orderBy === 'owner' ? order : 'asc'}
                onClick={createSortHandler('owner')}
              >
                Owner
                {orderBy === 'owner' ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stableSort(actionData, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(item => (
              <TableRow key={item.id} className={classes.actionRow}>
                <TableCell>{item.value}</TableCell>
                <TableCell>{retros.find(retro => retro.id === item.retroId)?.name}</TableCell>
                <TableCell>{item.owner}</TableCell>
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
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={actionData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
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
