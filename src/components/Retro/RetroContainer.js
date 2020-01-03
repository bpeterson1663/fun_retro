import React, { useState, useEffect, useContext } from "react";
import RetroColumn from "./RetroColumn";
import VoteContext from "../../context/vote-context";
import _ from "lodash";
import useStyles from "./Retro.styles";
import { db } from "../../firebase";
import AuthContext from "../../context/auth-context";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography/Typography";
import jsPDF from "jspdf";
import "jspdf-autotable";

const RetroContainer = props => {
  const [remaingVotes, setRemaingVotes] = useState(0);
  const [retroData, setRetroData] = useState({});
  const [retroStatus, setRetroStatus] = useState(true);
  const [retroExists, setRetroExists] = useState(true);
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
      setRemaingVotes(retroData.numberOfVotes - userVoteCount);
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

  const retroContainer = (
    <Container style={{ padding: "8px" }} data-id="retro_container">
      <Typography variant="h4">{retroData.name}</Typography>
      <Typography variant="subtitle1">
        {retroData.startDate} through {retroData.endDate}
      </Typography>
      <Typography variant="subtitle2">
        {retroStatus ? `Remaining Votes: ${remaingVotes}` : `Retro Has Ended`}
      </Typography>
      {retroData.userId === auth.userId ? (
        <Button size="small" color="secondary" onClick={handleRetroStatus}>
          {retroStatus ? `End Retro` : `Activate Retro`}{" "}
        </Button>
      ) : null}
      <Button size="small" color="secondary" onClick={handleGenerateReport}>
        Generate Report{" "}
      </Button>
      <Grid container justify="center" spacing={0}>
        <VoteContext.Provider
          value={{ votes: remaingVotes, setRemaingVotes: setRemaingVotes }}
        >
          <Grid className={classes.keepDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={props.numberOfVotes}
              getUserVoteStatus={getUserVoteStatus}
              remaingVotes={remaingVotes}
              title="Keep Doing"
              columnName="keepDoing"
              isActive={retroStatus}
            />
          </Grid>
          <Grid className={classes.stopDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={props.numberOfVotes}
              getUserVoteStatus={getUserVoteStatus}
              remaingVotes={remaingVotes}
              title="Stop Doing"
              columnName="stopDoing"
              isActive={retroStatus}
            />
          </Grid>
          <Grid className={classes.startDoing}>
            <RetroColumn
              retroId={retroId}
              votesPerPerson={props.numberOfVotes}
              getUserVoteStatus={getUserVoteStatus}
              remaingVotes={remaingVotes}
              title="Start Doing"
              columnName="startDoing"
              isActive={retroStatus}
            />
          </Grid>
        </VoteContext.Provider>
      </Grid>
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
