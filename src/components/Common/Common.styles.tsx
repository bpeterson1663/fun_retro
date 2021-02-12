import { makeStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

const useStyles = makeStyles(
  theme => ({
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      height: 50,
      position: 'fixed',
      bottom: 0,
      marginTop: 40,
      width: '100%',
      backgroundColor: theme.palette.primary.main,
    },
    copyright: {
      color: '#fff',
      maxWidth: 300,
      '&:hover': {
        cursor: 'auto',
      },
    },
    faqButton: {
      color: '#fff',
      '&:hover': {
        cursor: 'auto',
      },
    },
    faq: {
      textDecoration: 'none',
      color: '#fff',
    },
    button: {
      margin: theme.spacing(1),
      color: '#fff',
    },
    header: {
      fontWeight: 'bold',
    },
    buttonContainer: {
      margin: '0 0 0 auto',
    },
    dialogContent: {
      width: '90%',
      margin: 'auto',
      display: 'flex',
      flexFlow: 'row wrap',
      justifyContent: 'center',
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    success: {
      backgroundColor: green[600],
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
  { index: 1 },
)

export default useStyles
