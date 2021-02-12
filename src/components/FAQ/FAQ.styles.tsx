import { makeStyles } from '@material-ui/core/styles'
import { colors } from '../../constants/columns.constants'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    margin: '0 auto',
    flexShrink: 0,
    backgroundColor: 'red',
    width: '98%',
    height: 40,
    borderRadius: 4,
    padding: '8px 0',
    color: 'white',
  },
  panel: {
    marginTop: 10,
  },
  green: {
    backgroundColor: colors.green,
  },
  red: {
    backgroundColor: colors.red,
  },
  purple: {
    backgroundColor: colors.purple,
  },
  blue: {
    backgroundColor: colors.blue,
  },
  back: {
    display: 'flex',
    fontSize: 12,
  },
}))

export default useStyles
