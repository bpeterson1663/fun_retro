import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Container, Grid, Typography, LinearProgress, Button } from '@material-ui/core'
import useStyles from './AdminContainer.styles'
import ActionItemList from './ActionItemList'
import CreateActionItemDialog from '../Retro/ActionItem/CreateActionItemDialog'
import { db } from '../../firebase'
import { getTeams, getActionItemsByTeam, getActionItemsByUser, getAllRetros } from '../../api/index'
import AuthContext from '../../context/auth-context'
import { ActionItemTable, RetroType, ManageTeamsType } from '../../constants/types.constant'
import SnackBar from '../Common/SnackBar'
import dayjs from 'dayjs'

const ManageActionItems: React.FC = (): JSX.Element => {
  const auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [allTeams, setAllTeams] = useState<ManageTeamsType[]>([])
  const [allRetros, setAllRetros] = useState<RetroType[]>([])
  const [counter, setCounter] = useState(0)
  const [showActionItemDialog, setShowActionItemDialog] = useState(false)
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
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
            tableUpdated: () => {
              return
            },
          })
          docs.forEach(doc => {
            const itemData = doc.data()
            const map = itemMap.find(m => m.id === auth.userId)
            const itemIndex = itemMap.findIndex(m => m.id === auth.userId)
            if (itemIndex >= 0 && map) {
              map.data.push({
                value: itemData.value,
                retroId: itemData.retroId,
                teamId: itemData.teamId,
                id: doc.id,
                retroName: '',
                owner: itemData.owner ? itemData.owner : '',
                timestamp: itemData.timestamp ? itemData.timestamp : dayjs().valueOf(),
                completed: typeof itemData.completed === 'boolean' ? itemData.completed : false,
                completedDate: itemData.completedDate ? itemData.completedDate : '',
              })
              itemMap[itemIndex] = map
            }
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
            tableUpdated: () => {
              return
            },
          })
          return getActionItemsByTeam(team.id)
        })
        setAllTeams(resTeams)

        Promise.all(promises).then(res => {
          res.forEach(querySnapshot => {
            querySnapshot.docs.forEach(doc => {
              const itemData = doc.data()
              const map = itemMap.find(m => m.id === itemData.teamId)
              const itemIndex = itemMap.findIndex(m => m.id === itemData.teamId)
              if (itemIndex && map) {
                map.data.push({
                  value: itemData.value,
                  retroId: itemData.retroId,
                  teamId: itemData.teamId,
                  id: doc.id,
                  retroName: '',
                  owner: itemData.owner ? itemData.owner : '',
                  timestamp: itemData.timestamp ? itemData.timestamp : dayjs().valueOf(),
                  completed: typeof itemData.completed === 'boolean' ? itemData.completed : false,
                  completedDate: itemData.completedDate ? itemData.completedDate : '',
                })

                itemMap[itemIndex] = map
              }
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

  const handleActionItemDialogClose = () => setShowActionItemDialog(false)

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }

  const createActionItem = (item: {
    value: string
    team: ManageTeamsType[]
    retroId: string
    owner: string
    timestamp: number
  }) => {
    //create Action Item for each team if multiple teams are selected
    setIsLoading(true)
    if (item.team.length > 0) {
      const promises = item.team.map(team => {
        return db.collection('actionItems').add({
          value: item.value,
          retroId: item.retroId,
          teamId: team.id,
          userId: auth.userId,
          owner: item.owner ? item.owner : '',
          timestamp: item.timestamp,
          completed: false,
          completedDate: '',
        })
      })
      Promise.all(promises)
        .then(() => {
          setIsLoading(false)
          setShowActionItemDialog(false)
          setCounter(c => c + 1)
          setMessageState({
            displayMessage: true,
            message: `Way to take action!`,
            messageStatus: 'success',
          })
        })
        .catch(err => {
          setMessageState({
            displayMessage: true,
            message: `${err}`,
            messageStatus: 'error',
          })
        })
    } else {
      db.collection('actionItems')
        .add({
          value: item.value,
          retroId: item.retroId,
          userId: auth.userId,
          teamId: '',
          owner: item.owner ? item.owner : '',
          timestamp: item.timestamp,
          completed: false,
          completedDate: '',
        })
        .then(() => {
          setIsLoading(false)
          setShowActionItemDialog(false)
          setCounter(c => c + 1)
          setMessageState({
            displayMessage: true,
            message: `Way to take action!`,
            messageStatus: 'success',
          })
        })
        .catch(err => {
          setMessageState({
            displayMessage: true,
            message: `${err}`,
            messageStatus: 'error',
          })
        })
    }
  }
  return (
    <Container>
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Typography variant="h5">Manage Action Items</Typography>
      <div className={classes.actionButtons}>
        <Button color="secondary" variant="contained" onClick={() => setShowActionItemDialog(true)}>
          Create Action Item
        </Button>
      </div>
      <Grid container justify="center" spacing={0}>
        {actionItemsMap.map(actionItems => (
          <ActionItemList
            teams={allTeams}
            retros={allRetros}
            key={actionItems.id}
            name={actionItems.name}
            data={actionItems.data}
            tableUpdated={handleTableUpdate}
          />
        ))}
        {messageState.displayMessage ? (
          <SnackBar
            open={messageState.displayMessage}
            message={messageState.message}
            status={messageState.messageStatus}
            onClose={handleMessageClose}
          />
        ) : null}
        {showActionItemDialog ? (
          <CreateActionItemDialog
            showActionItemDialog={showActionItemDialog}
            handleActionItemDialogClose={handleActionItemDialogClose}
            createActionItem={createActionItem}
            team={allTeams}
            retros={allRetros}
          />
        ) : null}
      </Grid>
    </Container>
  )
}

export default ManageActionItems
