import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography/Typography';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
    root: {
        height: 50,
        position: 'fixed',
        bottom: 0,
        marginTop: 40,
        width: '100%',
        backgroundColor: theme.palette.primary.main
    },
    copyright:{
        color: '#fff',
        paddingTop: 10,
        height: 30,
        margin: '5px auto 0 10px'
    },
    link: {
        textDecoration: 'none',
        margin: '5px 10px 0 auto'

    },
    gridContainer: {
        margin: 0
    },
    gridItem: {
        padding: 0
    }
}));
const Footer = () => {
    const currentYear = new moment()
    const classes = useStyles();
    return (
        <BottomNavigation
            className={classes.root}>
                <Typography className={classes.copyright} variant="caption" display="block">Copyright &copy; {currentYear.format('YYYY')} BJP Software All rights reserved</Typography>
                <Link to="/faq" className={classes.link}>
                    <Button color="secondary" variant="contained">
                        FAQ
                    </Button>
                </Link>
        </BottomNavigation>
    );
};

export default Footer;