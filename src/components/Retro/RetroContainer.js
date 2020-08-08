import React, { useState, useEffect, useContext } from "react";
import RetroColumn from "./RetroColumn";
import ActionItemDialog from "./ActionItem/ActionItemDialog";
import VoteContext from "../../context/vote-context";
import moment from "moment";
import _ from "lodash";
import useStyles from "./Retro.styles";
import { db } from "../../firebase";
import AuthContext from "../../context/auth-context";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography/Typography";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SnackBar from "../Common/SnackBar";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RetroContainer = props => {
  const [remainingVotes, setRemainingVotes] = useState(0);
  const [retroData, setRetroData] = useState({});
  const [retroStatus, setRetroStatus] = useState(true);
  const [retroExists, setRetroExists] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showActionItemDialog, setShowActionItemDialog] = useState(false);
  const [messageState, setMessageState] = useState({
    message: "",
    messageStatus: "",
    displayMessage: false
  });
  const auth = useContext(AuthContext);
  const retroId = props.match.params.id;
  const classes = useStyles();
  const columnMaps = [
    { title: "Keep Doing", value: "keepDoing", backgroundColor: "#009588" },
    { title: "Stop Doing", value: "stopDoing", backgroundColor: "#E91D63" },
    { title: "Start Doing", value: "startDoing", backgroundColor: "#9C28B0" }
  ];

  const init = () => {
    const unsubscribe = db
      .collection("retros")
      .doc(retroId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setRetroData(doc.data());
          setRetroStatus(retroData.isActive);
          getUserVoteStatus();
        } else {
          setRetroExists(false);
        }
      });
    return () => unsubscribe();
  };

  const getUserVoteStatus = () => {
    //Get Current Users votes for all columns
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where("retroId", "==", retroId)
        .get();
    });
    let allVotes = [];
    Promise.all(promises).then(res => {
      _.each(res, querySnapshot => {
        _.each(querySnapshot.docs, doc => {
          const data = doc.data();
          allVotes = allVotes.concat(data.voteMap);
        });
      });
      const userVoteCount = _.filter(allVotes, id => id === auth.userId).length;
      isNaN(retroData.numberOfVotes - userVoteCount) === true
        ? setRemainingVotes(0)
        : setRemainingVotes(retroData.numberOfVotes - userVoteCount);
    });
  };

  useEffect(init, [retroId, retroData.isActive, retroData.numberOfVotes]);

  const handleRetroStatus = () => {
    db.collection("retros")
      .doc(retroId)
      .update({ isActive: !retroStatus })
      .then(() => {
        setRetroStatus(!retroStatus);
      });
  };

  const handleGenerateReport = () => {
    const promises = columnMaps.map(column => {
      return db
        .collection(column.value)
        .where("retroId", "==", retroId)
        .get();
    });
    Promise.all(promises).then(res => {
      const allData = [];
      _.each(res, querySnapshot => {
        allData.push(
          querySnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            return data;
          })
        );
      });
      let doc = new jsPDF();

      _.each(columnMaps, (column, i) => {
        let columnHeader = [column.title, "Votes"];
        let rows = [];
        _.each(allData[i], item => {
          rows.push([item.value, item.votes]);
        });
        doc.autoTable({
          headStyles: { fillColor: column.backgroundColor, halign: "center" },
          head: [columnHeader],
          body: _.orderBy(rows, x => x[1], ["desc"]),
          columnStyles: {
            0: { columnWidth: 85 },
            1: { columnWidth: 20, halign: "center" }
          },
          theme: "grid"
        });
      });

      doc.save(retroData.name + ".pdf");
    });
  };

  const handleActionItemDialog = () => setShowActionItemDialog(true);

  const handleActionItemDialogClose = () => setShowActionItemDialog(false);

  const createActionItem = item => {
    setLoading(true);
    db.collection("actionItems")
      .add({
        value: item,
        retroId: retroId
      })
      .then(() => {
        setLoading(false);
        setShowActionItemDialog(false);
        setMessageState({
          displayMessage: true,
          message: `Way to take action!`,
          messageStatus: "success"
        });
      })
      .catch(err => {
        setMessageState({
          displayMessage: true,
          message: `${err}`,
          messageStatus: "error"
        });
      });
  };

  const handleMessageClose = () => {
    setMessageState({
      displayMessage: false,
      message: "",
      messageStatus: ""
    });
  };
  const retroContainer = (
    <Container
      style={{ padding: "8px", maxWidth: "100%" }}
      data-testid="retro_container"
    >
      {isLoading ? (
        <LinearProgress variant="query" />
      ) : (
        <div className={classes.placeHolder}></div>
      )}
      {messageState.displayMessage ? (
        <SnackBar
          open={messageState.displayMessage}
          message={messageState.message}
          status={messageState.messageStatus}
          close={handleMessageClose}
        />
      ) : null}
      <Typography variant="h4">{retroData.name}</Typography>
      <Typography variant="subtitle1">
        {moment(retroData.startDate).format("L")} through{" "}
        {moment(retroData.endDate).format("L")}
      </Typography>
      <Typography variant="subtitle2">
        {retroStatus ? `Remaining Votes: ${remainingVotes}` : `Retro Has Ended`}
      </Typography>
      {retroData.userId === auth.userId ? (
        <Button size="small" color="secondary" onClick={handleRetroStatus}>
          {retroStatus ? `End Retro` : `Activate Retro`}{" "}
        </Button>
      ) : null}
      <Button size="small" color="secondary" onClick={handleGenerateReport}>
        Generate Report{" "}
      </Button>
      {retroData.userId === auth.userId ? (
        <Button size="small" color="secondary" onClick={handleActionItemDialog}>
          Create Action Item
        </Button>
      ) : null}
      <Grid container justify="center" spacing={0}>
        <VoteContext.Provider
          value={{
            votes: remainingVotes,
            setRemainingVotes: setRemainingVotes
          }}
        >
          <Grid className={classes.keepDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={retroData.numberOfVotes}
              remainingVotes={remainingVotes}
              title="Keep Doing"
              columnName="keepDoing"
              isActive={retroStatus}
            />
          </Grid>
          <Grid className={classes.stopDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={retroData.numberOfVotes}
              remainingVotes={remainingVotes}
              title="Stop Doing"
              columnName="stopDoing"
              isActive={retroStatus}
            />
          </Grid>
          <Grid className={classes.startDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={retroData.numberOfVotes}
              remainingVotes={remainingVotes}
              title="Start Doing"
              columnName="startDoing"
              isActive={retroStatus}
            />
          </Grid>
        </VoteContext.Provider>
      </Grid>
      <ActionItemDialog
        showActionItemDialog={showActionItemDialog}
        handleActionItemDialogClose={handleActionItemDialogClose}
        createActionItem={createActionItem}
      />
    </Container>
  );

  const retroDoesNotExist = (
    <Container>
      <Typography variant="h3">Retro Does Not Exist</Typography>
    </Container>
  );

  return retroExists ? retroContainer : retroDoesNotExist;
};

export default RetroContainer;
