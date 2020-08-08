import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HelpIcon from '@material-ui/icons/Help'
import moment from 'moment'
import { Link } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
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
  gridContainer: {
    margin: 0,
  },
  gridItem: {
    padding: 0,
  },
}))
const Footer = () => {
  const currentYear = new moment()
  const classes = useStyles()

  return (
    <BottomNavigation className={classes.root} showLabels>
      <BottomNavigationAction
        className={classes.copyright}
        disabled
        component="div"
        label={`Copyright \u00A9 ${currentYear.format('YYYY')} BJP Software All rights
        reserved`}
      />
      <BottomNavigationAction
        className={classes.faqButton}
        label="FAQ"
        icon={
          <Link to="/faq" className={classes.faq}>
            <HelpIcon />
          </Link>
        }
      />
    </BottomNavigation>
  )
}

export default Footer
