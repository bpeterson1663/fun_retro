import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core'
import { RetroType, ManageTeamsType, ActionItemType } from '../../../constants/types.constant'
import Button from '@material-ui/core/Button'
import ActionItemList from '../../Admin/ActionItemList'
import { getRetroById, getActionItemsByTeam, getActionItemsByRetro } from '../../../api'
interface ViewActionItemDialogProps {
  showViewActionDialog: boolean
  handleViewActionDialogClose: () => void
  retroId: string
  retroData: RetroType
  team: ManageTeamsType[]
}
interface itemMapType {
  id: string
  name: string
  actions: ActionItemType[]
}
const ViewActionItemDialog: React.FC<ViewActionItemDialogProps> = (props): JSX.Element => {
  const { showViewActionDialog, handleViewActionDialogClose, retroId, retroData, team } = props
  const [actionItems, setActionItems] = useState<itemMapType[]>([])
  const [counter, setCounter] = useState(0)
  const [allRetros, setAllRetros] = useState<RetroType[]>([])
  useEffect(() => {
    getActionItemsByRetro(retroId)
      .then(querySnapshot => {
        const actions: ActionItemType[] = []
        querySnapshot.docs.forEach(doc => {
          const data = doc.data()
          if (!data.teamId) {
            const item = {
              ...data,
              id: doc.id,
            } as ActionItemType
            actions.push(item)
          }
        })
        setActionItems([{ id: retroId, name: retroData.name, actions: actions }])
        createTeamMap()
      })
      .catch(err => console.error(err))

    const createTeamMap = () => {
      const teamMap: itemMapType[] = []
      if (team.length <= 0) return
      const promises = team.map(t => {
        teamMap.push({ id: t.id, name: t.teamName, actions: [] })
        return getActionItemsByTeam(t.id)
      })
      Promise.all(promises).then(res => {
        res.forEach(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            const data = doc.data()
            const map = teamMap.find(m => m.id === data.teamId)
            const item = {
              ...data,
              id: doc.id,
            } as ActionItemType
            map?.actions.push(item)
          })
          const docsWithRetroIds = querySnapshot.docs.filter(doc => {
            const data = {
              ...doc.data(),
            } as ActionItemType
            return data.retroId
          })
          const promises = docsWithRetroIds.map(doc => {
            const data = doc.data()
            return getRetroById(data.retroId)
          })
          Promise.all(promises).then(res => {
            const retros: RetroType[] = []
            res.forEach(doc => {
              const data = {
                ...doc.data(),
                id: doc.id,
              } as RetroType
              retros.push(data)
            })
            setAllRetros([...retros, retroData])
            setActionItems(prevState => [...prevState, ...teamMap])
          })
        })
      })
    }
  }, [retroId, showViewActionDialog, team, counter, retroData])

  const handleTableUpdate = () => setCounter(c => c + 1)
  return (
    <Dialog
      fullWidth={true}
      maxWidth="lg"
      scroll="body"
      data-testid="actionitem_dialog"
      open={showViewActionDialog}
      onClose={handleViewActionDialogClose}
    >
      <DialogTitle>
        <Typography>Action Items</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container justify="center" spacing={0}>
          {actionItems.map(item => {
            return (
              <ActionItemList
                teams={team}
                retros={allRetros}
                key={item.id}
                name={item.name}
                data={item.actions}
                tableUpdated={handleTableUpdate}
              />
            )
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleViewActionDialogClose} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
ViewActionItemDialog.propTypes = {
  showViewActionDialog: PropTypes.bool.isRequired,
  handleViewActionDialogClose: PropTypes.func.isRequired,
  retroId: PropTypes.string.isRequired,
  retroData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    team: PropTypes.array.isRequired,
    numberOfVotes: PropTypes.number.isRequired,
    columnsKey: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  team: PropTypes.array.isRequired,
}
export default ViewActionItemDialog
