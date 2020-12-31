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
  const [actionItemsMap, setActionItemsMap] = useState<ActionItemTable[]>([])
  const classes = useStyles()

  useEffect(() => {
    const fetchData = () => {
      const itemMap: ActionItemTable[] = []
      getAllRetros(auth.userId).then(data => {
        const retros: RetroType[] = []
        data.docs.forEach(doc => {
          const retroData = doc.data()
          const retro = {
            ...retroData,
            id: doc.id,
            team: retroData.team ? retroData.team : [],
          } as RetroType
          retros.push(retro)
        })
        setAllRetros(retros)
      })
      getActionItemsByUser(auth.userId).then(data => {
        const docs = data.docs
        if (docs.length) {
          itemMap.push({ id: auth.userId, name: 'Action Items with No Team', data: [], retros: [], teams: [] })
          docs.forEach(doc => {
            const itemData = doc.data()
            const map = itemMap.find(m => m.id === auth.userId)
            map?.data.push({
              value: itemData.value,
              retroId: itemData.retroId,
              teamId: itemData.teamId,
              id: doc.id,
            })
            const newState = [...actionItemsMap].concat(itemMap)
            setActionItemsMap(newState)
          })
        }
      })
      getTeams(auth.userId).then(res => {
        const resTeams: ManageTeamsType[] = []
        res.docs.forEach(team => {
          const teamData = team.data()
          teamData.id = team.id
          resTeams.push(teamData as ManageTeamsType)
          itemMap.push({ id: team.id, name: teamData.teamName, data: [], retros: [], teams: [] })
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
              const newState = [...actionItemsMap].concat(itemMap)
              setActionItemsMap(newState)
            })
          })
        })
        setAllTeams(resTeams)
        setIsLoading(false)
      })
    }
    fetchData()
  }, [auth.userId])

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
          />
        ))}
      </Grid>
    </Container>
  )
}

export default ManageActionItems
