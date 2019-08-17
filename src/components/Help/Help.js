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
                    Using Super Fun Retro is easy! Simple create your retro and then send the link that is generated out to your team. Your team members then login and can start entering in feedback in three different categories; Keep Doing, Stop Doing, and Start Doing. 
                    Each team member can then vote for any item added they like. All feedback is anonymous to help encourage a safe and free environment to provide more honest feedback. 
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
        </Container>
    );
};

export default Help;