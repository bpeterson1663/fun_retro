import { makeStyles } from "@material-ui/core/styles";

const columnStyle = {
  borderRadius: 10,
  padding: 5,
  margin: "5px 10px",
  width: "30%"
};

const useStyles = makeStyles(theme => ({
  keepDoing: {
    backgroundColor: "#009588",
    ...columnStyle
  },
  stopDoing: {
    backgroundColor: "#E91D63",
    ...columnStyle
  },
  startDoing: {
    backgroundColor: "#9C28B0",
    ...columnStyle
  },
  inputField: {
    margin: "10px auto",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10
  },
  button: {
    display: "inherit",
    margin: "auto"
  },
  card: {
    width: "100%",
    margin: "10px auto"
  },
  votes: {
    margin: "15px 2px",
    height: 20,
    width: 20,
    fontSize: 10,
    backgroundColor: theme.palette.primary.main
  },
  placeHolder: {
    height: 5
  },
  header: {
    color: "white"
  },
  avatar: {
    margin: 0,
    height: 30,
    width: 30,
    fontSize: 16,
    backgroundColor: theme.palette.primary.main
  },
  cardHeader: {
    padding: "10px 0 5px 0",
    float: "right",
    margin: 0
  },
  cardConent: {
    paddingBottom: 0,
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    textAlign: "left"
  },
  cardAction: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between"
  },
  remove: {
    fontSize: 8,
    width: 15,
    marginRight: "auto"
  },
  voteContainer: {
    display: "flex",
    flexFlow: "row wrap",
    padding: "0 10px"
  },
  editContainer: {
    padding: "0 10px",
    display: "flex",
    flexFlow: "row wrap"
  },
  editTextBox: {
    width: "100%"
  }
}));

export default useStyles;
