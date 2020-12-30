import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  IconButton,
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
import { deleteActionItem } from '../../api/index'

const ActionItemList: React.FC<ActionItemTable> = ({ name, data, id }): JSX.Element => {
  const classes = useStyles()
  const [actionData, setActionData] = useState<ActionItemType[]>([])
  const [isEmptyTable, setIsEmptyTable] = useState(false)
  useEffect(() => {
    data.length > 0 ? setActionData(data) : setIsEmptyTable(true)
  }, [])
  const handleDelete = (id: string, retroId: string) => {
    deleteActionItem(id).then(() => {
      const newData = actionData.filter(action => action.id !== id)
      newData.length > 0 ? setActionData(newData) : setIsEmptyTable(true)
    })
  }

  
  return isEmptyTable ? (
    <></>
  ) : (
    <TableContainer className={classes.actionTable}>
      <Typography>{name}</Typography>
      <Table aria-label="manage action items">
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
            <TableRow key={item.id}>
              <TableCell>{item.value}</TableCell>
              <TableCell>{item.retroName}</TableCell>
              <TableCell>Edit Button</TableCell>
              <TableCell>
                <IconButton edge="end" onClick={() => handleDelete(item.id, id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ActionItemList
