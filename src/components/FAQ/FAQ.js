import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button/Button";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    margin: "0 auto",
    flexShrink: 0,
    backgroundColor: "red",
    width: "98%",
    height: 40,
    borderRadius: 4,
    padding: "8px 0",
    color: "white"
  },
  panel: {
    marginTop: 10
  },
  green: {
    backgroundColor: "#009588" //TODO: moves to a constant
  },
  pink: {
    backgroundColor: "#E91D63"
  },
  purple: {
    backgroundColor: "#9C28B0"
  },
  back: {
    display: "flex",
    fontSize: 12
  }
}));
const FAQ = props => {
  const [expanded, setExpanded] = React.useState(false);
  const classes = useStyles();

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Container>
      <Button
        color="secondary"
        variant="contained"
        sizeSmall
        className={classes.back}
        onClick={() => props.history.goBack()}
      >
        Back
      </Button>
      <Typography variant="h3">FAQ</Typography>
      <Typography variant="subtitle1">
        Here to answer all your questions
      </Typography>
      <ExpansionPanel
        className={classes.panel}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={[classes.heading, classes.green]}>
            What is Super Fun Retro?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Super Fun Retro is an application to gather information and feedback
            from your team about how your sprint went! Sprint Retrospectives are
            an awesome opportunity to get your team together and talk about what
            went well, what can you approve on and anything you should stop
            doing. As a manager, this can be important information to help
            create action items for future sprints. Super Fun Retro is easy,
            simple and of course fun to use!
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        className={classes.panel}
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={[classes.heading, classes.pink]}>
            How does Fun Retro work?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Using Super Fun Retro is easy! Simply create your retro and send the
            link that is generated out to your team. Your team members then
            login and can start entering in feedback in three different
            categories; Keep Doing, Stop Doing, and Start Doing. Each team
            member can then vote for any item they like. All feedback is
            anonymous to help encourage a safe and free environment to provide
            more honest feedback. Only the user who creates the Super Fun Retro
            will be able to acivate/disable the retro as well as edit, delete or
            generate a report.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        className={classes.panel}
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={[classes.heading, classes.purple]}>
            How much does it cost?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Absolutely nothing! It is free to use! No limits on how many people
            can sign up, no limits on how many retrospectives you can create,
            and no limits on how long you can use it! Other retro softwares out
            there charge you after a certain time period, which isn&apos;t
            really fun in my opinion.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        className={classes.panel}
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={[classes.heading, classes.green]}>
            Does everyone have to have an account that uses Super Fun Retro?
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Yes anyone who uses Super Fun Retro will need to create an account.
            Signing up is easy and all you need is an email.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Container>
  );
};

FAQ.propTypes = {
  history: PropTypes.object
};

export default FAQ;
