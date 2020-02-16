import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    'flex-direction': 'column',
    'max-width': 400,
    margin: '0 auto'
  },
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
