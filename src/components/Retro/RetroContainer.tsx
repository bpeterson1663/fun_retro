import React, { useState, useEffect, useContext, useCallback } from 'react'
import RetroColumn from './RetroColumn'
import CreateActionItemDialog from './ActionItem/CreateActionItemDialog'
import VoteContext from '../../context/vote-context'
import useStyles from './Retro.styles'
import { db } from '../../firebase'
import AuthContext from '../../context/auth-context'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container/Container'
import Typography from '@material-ui/core/Typography/Typography'
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MenuIcon from '@material-ui/icons/Menu'
import Fab from '@material-ui/core/Fab'
import ViewActionItemDialog from './ActionItem/ViewActionItemDialog'
import SnackBar from '../Common/SnackBar'
import { columnKeys } from '../../constants/columns.constants'
import jsPDF from "jspdf"
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { ManageTeamsType, RetroType } from '../../constants/types.constant'
dayjs.extend(LocalizedFormat)
interface RetroContainerT {
  match: {
    params?: {
      id?: string
    }
  }
}

interface ColumnTypeT {
  title: string
  value: string
  backgroundColor: string
}
const RetroContainer: React.FC<RetroContainerT> = (props): JSX.Element => {
  const [remainingVotes, setRemainingVotes] = useState(0)
  const [retroData, setRetroData] = useState<RetroType>({} as RetroType)
  const [retroStatus, setRetroStatus] = useState(true)
  const [retroExists, setRetroExists] = useState(true)
  const [isLoading, setLoading] = useState(false)
  const [columnMaps, setColumnMaps] = useState<ColumnTypeT[]>([])
  const [showActionItemDialog, setShowActionItemDialog] = useState(false)
  const [showViewActionDialog, setShowViewActionDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const [messageState, setMessageState] = useState({
    message: '',
    messageStatus: '',
    displayMessage: false,
  })
  const auth = useContext(AuthContext)
  const retroId = props?.match?.params?.id
  const classes = useStyles()

  const init = () => {
    const unsubscribe = db
      .collection('retros')
      .doc(retroId)
      .onSnapshot(doc => {
        if (doc.exists) {
          const docData = doc.data()
          const retro = {
            ...docData,
            id: doc.id,
            team: docData?.team ? docData?.team : []
          } as RetroType

          setRetroData(retro)
          setRetroStatus(retro.isActive)
          const columnMaps = retro.columnsKey ? columnKeys[retro.columnsKey] : columnKeys['keepDoing']
          setColumnMaps(columnMaps)
          getUserVoteStatus()
        } else {
          setRetroExists(false)
        }
      })
    return () => unsubscribe()
  }

  const getUserVoteStatus = useCallback(() => {
    //Get Current Users votes for all columns
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', retroId)
        .get()
    })
    let allVotes: string[] = []
    Promise.all(promises).then(res => {
      res.forEach(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          const data = doc.data()
          allVotes = allVotes.concat(data.voteMap)
        })
      })
      const userVoteCount = allVotes.filter(id => id === auth.userId).length
      isNaN(retroData.numberOfVotes - userVoteCount) === true
        ? setRemainingVotes(0)
        : setRemainingVotes(retroData.numberOfVotes - userVoteCount)
    })
  }, [auth.userId, columnMaps, retroId, retroData.numberOfVotes])

  useEffect(init, [retroId, retroData.isActive, retroData.numberOfVotes, columnMaps, getUserVoteStatus])

  const handleRetroStatus = () => {
    handleMenuClose()
    db.collection('retros')
      .doc(retroId)
      .update({ isActive: !retroStatus })
      .then(() => {
        setRetroStatus(!retroStatus)
      })
  }

  const handleGenerateReport = () => {
    handleMenuClose()
    let reportSections = [{ title: 'Action Items from Retro', value: 'actionItems', backgroundColor: '#2196f3' }]
    reportSections = reportSections.concat(columnMaps)

    const promises = reportSections.map(column => {
      return db
        .collection(column.value)
        .where('retroId', '==', retroId)
        .get()
    })
    Promise.all(promises).then(res => {
      const allData: Array<Array<{value: string, votes: string, id: string}>> = []
      res.forEach(querySnapshot => {
          allData.push(querySnapshot.docs.map(doc => {
            const data = doc.data()
            const dataObj: {value: string, votes: string, id: string} ={
              value: data.value,
              votes: data.votes,
              id: doc.id
            }
            return dataObj;
          })
          )
        })
      const doc = new jsPDF()
      reportSections.forEach((column, i) => {
        const columnHeader = column.value === 'actionItems' ? [column.title] : [column.title, 'Votes']
        const rows: Array<Array<string>> = []
        allData[i].forEach(item => {
          column.value === 'actionItems' ? rows.push([item.value]) : rows.push([item.value, item.votes])
        })
        autoTable(doc, {
          headStyles: { fillColor: column.backgroundColor, halign: 'center' },
          head: [columnHeader],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: rows.concat().sort((a: any, b: any) => b[1] - a[1]),
          columnStyles: {
            0: { cellWidth: 85 },
            1: { cellWidth: 20, halign: 'center' },
          },
          theme: 'grid',
        })
      })

      doc.save(retroData.name + '.pdf')
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleActionItemDialog = () => {
    handleMenuClose()
    setShowActionItemDialog(true)
  }

  const handleActionItemDialogClose = () => setShowActionItemDialog(false)

  const handleViewActionDialog = () => {
    handleMenuClose()
    setShowViewActionDialog(true)
  }

  const handleViewActionDialogClose = () => setShowViewActionDialog(false)

  const createActionItem = (item: {
    value: string
    team: ManageTeamsType[]
    retroId: string
    owner: string
    timestamp: number
  }) => {
    //create Action Item for each team if multiple teams are selected
    setLoading(true)
    if (item.team.length > 0) {
      const promises = item.team.map(team => {
        return db.collection('actionItems').add({
          value: item.value,
          retroId: retroId,
          teamId: team.id,
          userId: auth.userId,
          owner: item.owner ? item.owner : '',
          timestamp: dayjs().valueOf(),
          completed: false,
          completedDate: '',
        })
      })
      Promise.all(promises)
        .then(() => {
          setLoading(false)
          setShowActionItemDialog(false)
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
          retroId: retroId,
          userId: auth.userId,
          teamId: '',
          owner: item.owner ? item.owner : '',
          timestamp: dayjs().valueOf(),
          completed: false,
          completedDate: '',
        })
        .then(() => {
          setLoading(false)
          setShowActionItemDialog(false)
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
  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: '',
      messageStatus: '',
    })
  }
  const retroContainer = (
    <Container style={{ padding: '8px', maxWidth: '100%' }} data-testid="retro_container">
      {isLoading ? <LinearProgress variant="query" /> : <div className={classes.placeHolder}></div>}
      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          onClose={handleMessageClose}
        />
      ) : null}
      <Fab
        color="primary"
        className={classes.fab}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </Fab>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {retroData.userId === auth.userId ? (
          <MenuItem onClick={handleRetroStatus}>{retroStatus ? `End Retro` : `Activate Retro`} </MenuItem>
        ) : null}
        <MenuItem onClick={handleGenerateReport}>Generate Report </MenuItem>
        <MenuItem onClick={handleActionItemDialog}>Create Action Item</MenuItem>
        <MenuItem onClick={handleViewActionDialog}>View Action Items</MenuItem>
      </Menu>
      <Typography variant="h4">{retroData.name}</Typography>
      <Typography variant="subtitle1">
        {dayjs(retroData.startDate).format('L')} through {dayjs(retroData.endDate).format('L')}
      </Typography>
      <Typography variant="subtitle2">
        {retroStatus ? `Remaining Votes: ${remainingVotes}` : `Retro Has Ended`}
      </Typography>
      <Grid container wrap="nowrap" spacing={0} style={{ width: '100%', overflowX: 'scroll' }}>
        <VoteContext.Provider
          value={{
            votes: remainingVotes,
            setRemainingVotes: setRemainingVotes,
          }}
        >
          {columnMaps.map(column => {
            return (
              <Grid
                key={column.value}
                className={classes.columnStyle}
                style={{ backgroundColor: column.backgroundColor }}
              >
                <RetroColumn
                  retroId={retroId}
                  votesPerPerson={retroData.numberOfVotes}
                  columnsKey={retroData.columnsKey}
                  title={column.title}
                  columnName={column.value}
                  isActive={retroStatus}
                />
              </Grid>
            )
          })}
        </VoteContext.Provider>
      </Grid>
      {showActionItemDialog ? (
        <CreateActionItemDialog
          showActionItemDialog={showActionItemDialog}
          handleActionItemDialogClose={handleActionItemDialogClose}
          createActionItem={createActionItem}
          team={retroData.team}
          retros={[retroData]}
        />
      ) : null}

      {showViewActionDialog ? (
        <ViewActionItemDialog
          showViewActionDialog={showViewActionDialog}
          handleViewActionDialogClose={handleViewActionDialogClose}
          retroData={retroData}
          retroId={retroId}
          team={retroData.team}
        />
      ) : null}
    </Container>
  )

  const retroDoesNotExist = (
    <Container>
      <Typography variant="h3">Retro Does Not Exist</Typography>
    </Container>
  )

  return retroExists ? retroContainer : retroDoesNotExist
}

export default RetroContainer
