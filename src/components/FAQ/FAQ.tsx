import React from 'react'
import PropTypes from 'prop-types'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from '@material-ui/core'
import useStyles from './FAQ.styles'

interface FAQProps {
  history: { goBack: () => void }
}

const FAQ: React.FC<FAQProps> = (props): JSX.Element => {
  const classes = useStyles()
  return (
    <Container>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        className={classes.back}
        onClick={() => props.history.goBack()}
      >
        Back
      </Button>
      <Typography variant="h3">FAQ</Typography>
      <Typography variant="subtitle1">Here to answer all your questions</Typography>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.green}`}>What is Super Fun Retro?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Super Fun Retro is an application to gather information and feedback from your team about how your sprint
            went! Sprint Retrospectives are an awesome opportunity to get your team together and talk about what went
            well, what can you approve on and anything you should stop doing. As a manager, this can be important
            information to help create action items for future sprints. Super Fun Retro is easy, simple and of course
            fun to use!
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.red}`}>How does Fun Retro work?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Using Super Fun Retro is easy! Simply create your retro and send the link that is generated out to your team
            or if you create a Team, you can have the option to send an email to members of the team which will include
            the retro link. Your team members then login and can start entering in feedback. Each team member can then
            vote for any item they like. All feedback is anonymous to help encourage a safe and free environment to
            provide more honest feedback. Only the user who creates the Super Fun Retro will be able to acivate/disable
            the retro.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.purple}`}>What are Teams?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Teams are a great to keep your Retros and Action Items organized. When you create a team you have the option
            to add your team member&apos;s emails to the team. This will give you the option to send an email containg
            the retro link when you create a new retro to members on the team.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.blue}`}>What are Action Items?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Action Items are what Super Fun Retro is all about (other than having super amounts of fun!). The purpose of
            having a retrospective is to find out what went wrong and what you can improve on. Creating Action Items can
            be done in the Action menu on the retro board or under Manage Action Items. When creating an action item,
            you can assign a team and/or an owner for someone to follow up and complete the action item. You can edit
            the action item under View Action Items to mark the action item copmlete or under the Manage Action Items
            page.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.green}`}>How much does it cost?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Absolutely nothing! It is free to use! No limits on how many people can sign up, no limits on how many
            retrospectives you can create, and no limits on how long you can use it! Other retro softwares out there
            charge you after a certain time period, which isn&apos;t really fun in my opinion.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.panel}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography className={`${classes.heading} ${classes.red}`}>
            Does everyone have to have an account that uses Super Fun Retro?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes anyone who uses Super Fun Retro will need to create an account. Signing up is easy and all you need is
            an email.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Container>
  )
}
FAQ.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
}

export default FAQ
