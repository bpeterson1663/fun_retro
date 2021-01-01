import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteForeverOutlined'
import useStyles from './AdminContainer.styles'
import { ActionItemTable, ActionItemType } from '../../constants/types.constant'
import { deleteActionItem, editActionItemById } from '../../api/index'
import EditActionItemDialog from './Dialogs/EditActionItemDialog'
import EditIcon from '@material-ui/icons/Edit'

const ActionItemList: React.FC<ActionItemTable> = ({ name, data, id, retros, teams, tableUpdated }): JSX.Element => {
  const classes = useStyles()
  const [actionData, setActionData] = useState<ActionItemType[]>([])
  const [isEmptyTable, setIsEmptyTable] = useState(false)
  const [editItem, setEditItem] = useState<ActionItemType>({} as ActionItemType)
  const [editStatus, setEditStatus] = useState(false)
  useEffect(() => {
    data.length > 0 ? setActionData(data) : setIsEmptyTable(true)
  }, [data])
  const handleDelete = (id: string) => deleteActionItem(id).then(tableUpdated)

  const editActionItem = (item: { value: string; teamId: string }) => {
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
  return isEmptyTable ? (
    <></>
  ) : (
    <TableContainer component={Paper} className={classes.actionTable}>
      <Typography variant="h6">{name}</Typography>
      <Table aria-label="manage action items" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Retro</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {actionData.map(item => (
            <TableRow key={item.id} className={classes.actionRow}>
              <TableCell>{item.value}</TableCell>
              <TableCell>{retros.find(retro => retro.id === item.retroId)?.name}</TableCell>
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
    </TableContainer>
  )
}

export default ActionItemList
