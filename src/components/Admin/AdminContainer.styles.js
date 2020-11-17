import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  inputField: {
    margin: theme.spacing(2),
  },
  inputFieldText: {
    width: 350,
  },
  icon: {
    marginLeft: 'auto',
  },
  card: {
    width: 550,
    margin: '10px 30px',
  },
  cardHeader: {
    padding: '10px 0 5px 0',
    margin: 0,
  },
  placeholder: {
    height: 5,
  },
  columnInfo: {
    width: '100%%',
    margin: 'auto',
  },
  cardConent: {
    paddingBottom: 0,
  },
  dialogContent: {
    width: 400,
    margin: 'auto',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center',
  },
  actionButtons: {
    display: 'flex',
    flexFlow: 'row-reverse wrap',
  },
  tableContainer: {
    maxWidth: 1200,
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  formControl: {
    display: 'flex',
    flexFlow: 'row wrap',
  },
  helpIcon: {
    marginTop: '1.5rem',
  },
}))

export default useStyles
