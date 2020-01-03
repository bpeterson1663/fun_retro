import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  inputField: {
    margin: theme.spacing(2)
  },
  placeHolder: {
    height: 5
  },
  submit: {
    display: "block",
    margin: "10px auto"
  },
  links: {
    margin: 10
  }
}));

export default useStyles;
