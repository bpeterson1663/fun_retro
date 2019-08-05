import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    inputField: {
      margin: theme.spacing(2),
    },
    icon: {
        marginLeft: "auto"
    },
    card: {
        width: 550,
        margin: '10px 30px'
    },
    cardHeader: {
        padding: '10px 0 5px 0',
        margin: 0
    },
    placeholder: {
        height: 5
    },
    submit:{
        display: 'block',
        margin: 'auto'
    },
    columnInfo: {
        width: '100%%',
        margin: 'auto'
    },
    cardConent: {
        paddingBottom: 0
    },
    form: {
        width: 400,
        margin: 'auto'
    }
}));

export default useStyles;