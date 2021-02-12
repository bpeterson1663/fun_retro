import React from 'react'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import HelpIcon from '@material-ui/icons/Help'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import useStyles from './Common.styles'

const Footer: React.FC = (): JSX.Element => {
  const currentYear = dayjs()
  const classes = useStyles()
  return (
    <BottomNavigation className={classes.footer} showLabels>
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
