import React, { useState, useEffect } from 'react'
import { db } from '../../../firebase'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import useStyles from '../Retro.styles'
import {RetroType, ManageTeamsType, ActionItemType} from '../../../constants/types.constant'
import Button from '@material-ui/core/Button'
import ActionItemList from '../../Admin/ActionItemList'
import { getRetroById } from '../../../api'
interface ViewActionItemDialogProps{
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
const ViewActionItemDialog: React.FC<ViewActionItemDialogProps> = (props): JSX.Element =>  {
  const { showViewActionDialog, handleViewActionDialogClose, retroId, retroData, team } = props
  const classes = useStyles()
  const [actionItems, setActionItems] = useState<itemMapType[]>([])
  const [counter, setCounter] = useState(0)
  const [allRetros, setAllRetros] = useState<RetroType[]>([])
  useEffect(() => {
    const actionItemMap:itemMapType[] = []
    if (team.length > 0) {
      const promises = team.map(t => {
        actionItemMap.push({ id: t.id, name: t.teamName, actions: [] })
        return db
          .collection('actionItems')
          .where('teamId', '==', t.id)
          .get()
      })
      Promise.all(promises).then(res => {
        res.forEach(querySnapshot => {
          querySnapshot.docs.forEach(doc => {
            const data = doc.data()
            const map = actionItemMap.find(m => m.id === data.teamId)
            const item = {
              ...data,
              id: doc.id
            } as ActionItemType
            map?.actions.push(item)
                      
          })
          const docsWithRetroIds = querySnapshot.docs.filter(doc => {
           const data = {
             ...doc.data()
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
                id: doc.id
              } as RetroType
              retros.push(data)
            })
            setAllRetros(retros)
          })
        })
        setActionItems(actionItemMap)
      })
    } else {
      db.collection('actionItems')
        .where('retroId', '==', retroId)
        .get()
        .then(querySnapshot => {
          const actions: ActionItemType[] = []
          querySnapshot.docs.forEach(doc => {
            const data = doc.data()
            const item = {
              ...data,
              id: doc.id
            } as ActionItemType
           
            actions.push(item)

          })
          setActionItems([{ id: retroId, name: retroData.name, actions: actions }])
          setAllRetros([retroData])
        })
        .catch(err => console.error(err))
    }
  }, [retroId, showViewActionDialog, team, counter, retroData])

  const handleTableUpdate = () => setCounter(c => c + 1)
  return (
    <Dialog data-testid="actionitem_dialog" open={showViewActionDialog} onClose={handleViewActionDialogClose}>
      <DialogTitle>
        <Typography>Action Items</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
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
