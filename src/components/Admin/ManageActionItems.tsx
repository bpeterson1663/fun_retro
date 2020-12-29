import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import {
  Container,
  Grid,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import useStyles from './AdminContainer.styles'
import { getTeams, getActionItemsByTeam, getActionItemsByUser } from '../../api/index'
import AuthContext from '../../context/auth-context'
import { ActionItemType } from '../../constants/types.constant'
interface ActionItemTable {
  name: string
  id: string
  data: ActionItemType[]
}
const ManageActionItems: React.FC = (): JSX.Element => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [actionItemsMap, setActionItemsMap] = useState<ActionItemTable[]>([])
  const classes = useStyles()

  useEffect(() => {
    const fetchData = () => {
      const itemMap: ActionItemTable[] = []

      getActionItemsByUser(auth.userId).then(data => {
        const docs = data.docs
        if (docs.length) {
          itemMap.push({ id: auth.userId, name: 'Action Items with No Team', data: [] })
          debugger
          docs.forEach(doc => {
            const itemData = doc.data()
            const map = itemMap.find(m => m.id === auth.userId)
            map?.data.push({
              value: itemData.value,
              retroId: itemData.retroId,
              teamId: itemData.teamId,
              id: doc.id,
            })
            const newState = actionItemsMap.concat(itemMap)
            setActionItemsMap(newState)
          })
        }
      })

      getTeams(auth.userId).then(res => {
        res.docs.forEach(team => {
          const teamData = team.data()
          itemMap.push({ id: team.id, name: teamData.teamName, data: [] })
          getActionItemsByTeam(team.id).then(data => {
            const docs = data.docs
            docs.forEach(doc => {
              const itemData = doc.data()
              const map = itemMap.find(m => m.id === itemData.teamId)
              map?.data.push({
                value: itemData.value,
                retroId: itemData.retroId,
                teamId: itemData.teamId,
                id: doc.id,
              })
              const newState = actionItemsMap.concat(itemMap)
              setActionItemsMap(newState)
            })
          })
        })
        setIsLoading(false)
      })
    }
    fetchData()
  }, [])

  const ActionItemList: React.FC<ActionItemTable> = ({ name, data, id }): JSX.Element => {
    return (
      <TableContainer>
        <Typography>{name}</Typography>
        <Table aria-label="manage action items">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.value}</TableCell>
                <TableCell>Edit Button</TableCell>
                <TableCell>Delete Button</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Manage Action Items</Typography>
      <Grid container justify="center" spacing={0}>
        {actionItemsMap.map(actionItems => (
          <ActionItemList key={actionItems.id} id={actionItems.id} name={actionItems.name} data={actionItems.data} />
        ))}
      </Grid>
    </Container>
  )
}

export default ManageActionItems
