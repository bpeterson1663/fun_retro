import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      margin: '0 auto',
      flexShrink: 0,
    }
  }));
const Help = () => {
    const [expanded, setExpanded] = React.useState(false);
    const classes = useStyles();

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };
    return (
        <Container>
            <Typography variant="h3">Help</Typography>
            <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                <Typography className={classes.heading}>What is Super Fun Retro?</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>
                    Super Fun Retro is an application to collect information and feedback from your team about how your sprint went! As a manager, this can be important information to help create action items for future sprints. 
                    Super Fun Retro is easy, simple and of course fun to use!   
                </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                <Typography className={classes.heading}>How does Fun Retro work?</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>
                    Using Super Fun Retro is easy! Simply create your retro and send the link that is generated out to your team. Your team members then login and can start entering in feedback in three different categories; Keep Doing, Stop Doing, and Start Doing. 
                    Each team member can then vote for any item added they like. All feedback is anonymous to help encourage a safe and free environment to provide more honest feedback. 
                    Only the user who creates the Super Fun Retro will be able to acivate/disable the retro as well as edit, delete or generate a report. 
                </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                <Typography className={classes.heading}>How much does it cost?</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>
                    Absolutely nothing! It is free to use! No limits on how many people can sign up, no limits on how many retrospectives you can create, and no limits on how long you can use it! 
                    Other so called "Fun Retros" charge you after a certain time period, which isn't really fun in my opinion.
                </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    >
                <Typography className={classes.heading}>Does everyone have to have an account that uses Super Fun Retro?</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                <Typography>
                    Yes anyone who uses Super Fun Retro will need to create an account. Signing up is easy and all you need is an email.
                </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Container>
    );
};

export default Help;