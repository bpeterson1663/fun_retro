import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { db, incrementCounter, decrementCounter } from "../../firebase";
import AuthContext from "../../context/auth-context";
import VoteContext from "../../context/vote-context";
import _ from "lodash";
import moment from "moment";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import ThumbUp from "@material-ui/icons/ThumbUp";
import Typography from "@material-ui/core/Typography/Typography";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Avatar from "@material-ui/core/Avatar";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import CreateItem from "./Items/CreateItem";
import useStyles from "./Retro.styles";

const RetroColumn = props => {
  const { columnName, retroId, votesPerPerson } = props;
  const [itemList, setItemList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [itemEdit, setItemEdit] = useState({});
  const auth = useContext(AuthContext);
  const vote = useContext(VoteContext);
  const classes = useStyles();
  const columnMaps = [
    { title: "Keep Doing", value: "keepDoing", backgroundColor: "#009588" },
    { title: "Stop Doing", value: "stopDoing", backgroundColor: "#E91D63" },
    { title: "Start Doing", value: "startDoing", backgroundColor: "#9C28B0" }
  ];

  const init = () => {
    const unsubscribe = db
      .collection(columnName)
      .where("retroId", "==", retroId)
      .onSnapshot(querySnapshot => {
        _.each(querySnapshot.docChanges(), change => {
          if (change.type === "removed") {
            getUserVoteStatus();
          }
        });
        const columnData = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            data.id = doc.id;
            if (!data.voteMap) {
              data.voteMap = [];
            }
            return data;
          })
          .sort((a, b) => {
            return a.timestamp - b.timestamp;
          });
        setItemList(columnData);
        setLoading(false);
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
      vote.setRemainingVotes(votesPerPerson - userVoteCount);
    });
  };
  useEffect(init, [votesPerPerson]);

  const handleItemSubmit = value => {
    setLoading(true);
    db.collection(columnName)
      .add({
        value: value,
        retroId: retroId,
        userId: auth.userId,
        votes: 0,
        voteMap: [],
        timestamp: new moment().valueOf()
      })
      .finally(() => setLoading(false));
  };

  const handleItemVote = (operation, item) => {
    const itemRef = db.collection(columnName).doc(item.id);
    if (operation === "addVote") {
      if (item.voteMap) {
        item.voteMap.push(auth.userId);
      } else {
        item.voteMap = [auth.userId];
      }
      itemRef.update({ votes: incrementCounter, voteMap: item.voteMap });
      vote.setRemainingVotes(--vote.votes);
    } else {
      if (item.voteMap) {
        item.voteMap.splice(item.voteMap.indexOf(auth.userId), 1);
      } else {
        item.voteMap = [];
      }
      itemRef.update({ votes: decrementCounter, voteMap: item.voteMap });
      vote.setRemainingVotes(++vote.votes);
    }
  };

  const handleItemDelete = id => {
    setLoading(true);
    db.collection(columnName)
      .doc(id)
      .delete()
      .finally(() => setLoading(false));
  };

  const handleEditItem = item => {
    setEditMode(true);
    setItemEdit(item);
  };

  const resetEditMode = () => {
    setEditMode(false);
    setItemEdit({});
  };

  const handleUpdateItem = () => {
    setLoading(true);
    db.collection(columnName)
      .doc(itemEdit.id)
      .update({
        value: itemEdit.value
      })
      .then(() => resetEditMode())
      .finally(() => setLoading(false));
  };

  const getUsersVoteCount = item => {
    return _.filter(item.voteMap, id => auth.userId === id).length;
  };

  const disableDeleteVotes = item => {
    return vote.votes === votesPerPerson || getUsersVoteCount(item) === 0;
  };

  const showRemoveVote = item => {
    return getUsersVoteCount(item) > 0;
  };

  return (
    <Container style={{ padding: "8px" }}>
      {isLoading ? (
        <LinearProgress variant="query" />
      ) : (
        <div className={classes.placeHolder}></div>
      )}
      <Typography variant="h6" className={classes.header}>
        {props.title}
      </Typography>
      <CreateItem isActive={props.isActive} itemSubmit={handleItemSubmit} />
      {itemList.map((item, i) => {
        return (
          <Card key={i} className={classes.card}>
            <CardHeader
              className={classes.cardHeader}
              avatar={<Avatar className={classes.avatar}>{item.votes}</Avatar>}
            />
            <CardContent className={classes.cardConent}>
              {editMode && itemEdit.id === item.id ? (
                <TextField
                  variant="outlined"
                  multiline
                  rows="3"
                  maxLength="1000"
                  className={classes.editTextBox}
                  value={itemEdit.value}
                  onChange={e =>
                    setItemEdit({ ...itemEdit, value: e.target.value })
                  }
                />
              ) : (
                item.value
              )}
            </CardContent>
            <CardActions className={classes.cardAction}>
              <div className={classes.voteContainer}>
                <Avatar className={classes.votes}>
                  {getUsersVoteCount(item)}
                </Avatar>
                <IconButton
                  disabled={vote.votes === 0 || !props.isActive}
                  onClick={handleItemVote.bind(this, "addVote", item)}
                >
                  <ThumbUp />
                </IconButton>
                {showRemoveVote(item) ? (
                  <Button
                    className={classes.remove}
                    disabled={disableDeleteVotes(item) || !props.isActive}
                    onClick={handleItemVote.bind(this, "removeVote", item)}
                    vairant="outlined"
                    sizeSmall
                  >
                    Remove Vote
                  </Button>
                ) : null}
              </div>
              {auth.userId === item.userId ? (
                editMode && itemEdit.id === item.id ? (
                  <div className={classes.editContainer}>
                    <IconButton
                      disabled={!props.isActive}
                      onClick={handleUpdateItem.bind(this)}
                    >
                      <SaveIcon />
                    </IconButton>
                    <IconButton
                      disabled={!props.isActive}
                      onClick={resetEditMode.bind(this, item)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </div>
                ) : (
                  <div className={classes.editContainer}>
                    <IconButton
                      disabled={!props.isActive}
                      onClick={handleEditItem.bind(this, item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      disabled={!props.isActive}
                      onClick={handleItemDelete.bind(this, item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                )
              ) : null}
            </CardActions>
          </Card>
        );
      })}
    </Container>
  );
};

RetroColumn.propTypes = {
  columnName: PropTypes.string,
  isActive: PropTypes.bool,
  title: PropTypes.string,
  votesPerPerson: PropTypes.number,
  retroId: PropTypes.string,
  remaingVotes: PropTypes.number
};

export default RetroColumn;
