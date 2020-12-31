import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Grid, Typography, LinearProgress } from '@material-ui/core'
import useStyles from './AdminContainer.styles'
import ActionItemList from './ActionItemList'
import { getTeams, getActionItemsByTeam, getActionItemsByUser, getAllRetros } from '../../api/index'
import AuthContext from '../../context/auth-context'
import { ActionItemTable, RetroType, ManageTeamsType } from '../../constants/types.constant'
const ManageActionItems: React.FC = (): JSX.Element => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [allTeams, setAllTeams] = useState<ManageTeamsType[]>([])
  const [allRetros, setAllRetros] = useState<RetroType[]>([])
  const [counter, setCounter] = useState(0)
  const [actionItemsMap, setActionItemsMap] = useState<ActionItemTable[]>([])
  const classes = useStyles()

  useEffect(() => {
    const fetchData = () => {
      const itemMap: ActionItemTable[] = []
      Promise.all([getAllRetros(auth.userId), getActionItemsByUser(auth.userId), getTeams(auth.userId)]).then(res => {
        const [retroResponse, itemsByUserResponse, teamsResponse] = res
        const retros: RetroType[] = []
        retroResponse.docs.forEach(doc => {
          const retroData = doc.data()
          const retro = {
            ...retroData,
            id: doc.id,
            team: retroData.team ? retroData.team : [],
          } as RetroType
          retros.push(retro)
        })
        setAllRetros(retros)

        const docs = itemsByUserResponse.docs
        if (docs.length) {
          itemMap.push({
            id: auth.userId,
            name: 'Action Items with No Team',
            data: [],
            retros: [],
            teams: [],
            tableUpdated: () => {},
          })
          docs.forEach(doc => {
            const itemData = doc.data()
            const map = itemMap.find(m => m.id === auth.userId)
            map?.data.push({
              value: itemData.value,
              retroId: itemData.retroId,
              teamId: itemData.teamId,
              id: doc.id,
            })
          })
        }

        const resTeams: ManageTeamsType[] = []
        const promises = teamsResponse.docs.map(team => {
          const teamData = team.data()
          teamData.id = team.id
          resTeams.push(teamData as ManageTeamsType)
          itemMap.push({
            id: team.id,
            name: teamData.teamName,
            data: [],
            retros: [],
            teams: [],
            tableUpdated: () => {},
          })
          return getActionItemsByTeam(team.id)
        })
        setAllTeams(resTeams)

        Promise.all(promises).then(res => {
          res.forEach(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
              const itemData = doc.data()
              const map = itemMap.find(m => m.id === itemData.teamId)
              map?.data.push({
                value: itemData.value,
                retroId: itemData.retroId,
                teamId: itemData.teamId,
                id: doc.id,
              })
            })
          })
          setActionItemsMap(itemMap)
          setIsLoading(false)
        })
      })
    }
    fetchData()
  }, [auth.userId, counter])

  const handleTableUpdate = () => setCounter(c => c + 1)

  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Manage Action Items</Typography>
      <Grid container justify="center" spacing={0}>
        {actionItemsMap.map(actionItems => (
          <ActionItemList
            teams={allTeams}
            retros={allRetros}
            key={actionItems.id}
            id={actionItems.id}
            name={actionItems.name}
            data={actionItems.data}
            tableUpdated={handleTableUpdate}
          />
        ))}
      </Grid>
    </Container>
  )
}

export default ManageActionItems
