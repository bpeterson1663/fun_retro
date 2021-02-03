import React, { useEffect, useState, useContext } from 'react'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import { getAllRetros, deleteRetro } from '../../api/index'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography/Typography'
import RetroTable from './RetroTable'
import SnackBar from '../Common/SnackBar'
import useStyles from './AdminContainer.styles'
import { Link } from 'react-router-dom'
import DialogComponent from '../Common/DialogComponent'
import { columnKeys } from '../../constants/columns.constants'
import { ManageTeamsType, RetroType, RetroTypeString } from '../../constants/types.constants'
interface RetroMap {
  name: string
  id: string
  data: RetroType[]
}

const AdminContainer = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true)
  const [retroList, setRetroList] = useState<RetroMap[]>([])
  const [counter, setCounter] = useState(0)
  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const [retroToDelete, setRetroToDelete] = useState<RetroType>({} as RetroType)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const auth = useContext(AuthContext)
  const classes = useStyles()

  useEffect(() => {
    const retroMap: RetroMap[] = []
    getAllRetros(auth.userId).then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        const data = doc.data()
        data.id = doc.id
        data.team = data.team ? data.team : []
        if (data.team.length > 0) {
          data.team.forEach((t: ManageTeamsType) => {
            const map = retroMap.find(r => r.id === t.id)
            if (map) {
              map.data = [...map.data, { ...(data as RetroType) }]
            } else {
              retroMap.push({ name: t.teamName, id: t.id, data: [{ ...(data as RetroType) }] })
            }
          })
        } else {
          const map = retroMap.find(r => r.id === auth.userId)
          if (map) {
            map.data = [...map.data, { ...(data as RetroType) }]
          } else {
            retroMap.push({ name: 'Retros Without a Team', id: auth.userId, data: [{ ...(data as RetroType) }] })
          }
        }
      })
      retroMap.forEach(map => {
        map.data.sort((a, b) => {
          return b.timestamp - a.timestamp
        })
      })
      setRetroList(retroMap)
      setIsLoading(false)
    })
  }, [auth.userId, counter])

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }
  const handleConfirmOpen = (retro: RetroType) => {
    setRetroToDelete(retro)
    setConfirmDialogOpen(true)
  }

  const handleConfirmClose = () => {
    setRetroToDelete({} as RetroType)
    setConfirmDialogOpen(false)
  }

  const handleRetroDelete = (retro: RetroType) => {
    setIsLoading(true)
    const columnMaps = retro.columnsKey ? columnKeys[retro.columnsKey] : columnKeys['keepDoing']
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', retro.id)
        .get()
    })

    Promise.all(promises).then(res => {
      const batchDeletes = db.batch()
      res.forEach(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          batchDeletes.delete(doc.ref)
        })
      })
      batchDeletes.commit().then(() => {
        deleteRetro(retro.id)
          .then(() => {
            handleConfirmClose()
            setMessageState({
              displayMessage: true,
              message: 'Goodbye Retro! You have been deleted!',
              messageStatus: 'success',
            })
            setCounter(c => c + 1)
            setIsLoading(false)
          })
      })
    })
  }
  return (
    <Container data-testid="admin_container">
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeholder}></div>}
      <Grid container justify="center" spacing={0}>
        <Typography variant="h5">Manage Retros</Typography>
        <div className={classes.actionButtons}>
          <Link to="/createRetro" style={{ textDecoration: 'none' }}>
            <Button color="secondary" variant="contained">
              Create Retro
            </Button>
          </Link>
        </div>
        {retroList.length > 0
          ? retroList.map(map => (
              <RetroTable
                key={map.id}
                data={map.data as RetroTypeString[]}
                name={map.name}
                handleDelete={handleConfirmOpen}
              />
            ))
          : null}
      </Grid>

      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          onClose={handleMessageClose}
        />
      ) : null}

      {confirmDialogOpen ? (
        <DialogComponent
          open={confirmDialogOpen}
          onClose={handleConfirmClose}
          title="Delete Retro?"
          actions={[
            <Button
              key={0}
              data-testid="confirm-delete_button"
              onClick={handleRetroDelete.bind(this, retroToDelete)}
              color="secondary"
              variant="contained"
            >
              Delete It!
            </Button>,
            <Button
              key={1}
              data-testid="cancel-delete_button"
              onClick={handleConfirmClose.bind(this)}
              color="primary"
              variant="contained"
              autoFocus
            >
              No, Keep it.
            </Button>,
          ]}
        >
          Are you sure you want to say goodbye to this retro and delete it?
        </DialogComponent>
      ) : null}
    </Container>
  )
}

export default AdminContainer
