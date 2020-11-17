import * as React from 'react'
import { useEffect, useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Button from '@material-ui/core/Button'
import { db } from '../../../firebase'

interface DialogPropTypes {
  showDialog: boolean
  previousRetro: string
  handleViewPreviousCloseDialog: () => {}
}

interface ActionItemType {
  id: string
  retroId: string
  value: string
}
const ViewPreviousRetroActionDialog: React.FC<DialogPropTypes> = (props): JSX.Element => {
  const { showDialog, handleViewPreviousCloseDialog, previousRetro } = props
  const [actionItems, setActionItems] = useState<ActionItemType[]>([])
  useEffect(() => {
    if (previousRetro) {
      db.collection('actionItems')
        .where('retroId', '==', previousRetro)
        .get()
        .then(querySnapshot => {
          const docs: ActionItemType[] = []
          querySnapshot.docs.forEach(doc => {
            const data = doc.data()
            docs.push({
              id: doc.id,
              retroId: data.retroid,
              value: data.value,
            })
          })
          setActionItems(docs)
        })
    }
  }, [previousRetro])

  return (
    <Dialog open={showDialog} onClose={handleViewPreviousCloseDialog}>
      <DialogTitle>
        <Typography>Previous Action Items</Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {actionItems.length > 0
            ? actionItems.map((item, i) => <ListItem key={i}>{item.value}</ListItem>)
            : 'No Action Items from last Retro'}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleViewPreviousCloseDialog} color="secondary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewPreviousRetroActionDialog
