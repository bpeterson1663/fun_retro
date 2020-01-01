import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ls from "local-storage";

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

const IEWarning = () => {
  const [isIE, setIEState] = useState(
    (false || !!document.documentMode) && !ls.get("showIeDialog")
  );
  const classes = useStyles();
  const closeIEDialog = () => {
    setIEState(false);
    ls.set("showIeDialog");
  };
  return (
    <Dialog
      onClose={closeIEDialog}
      aria-labelledby="customized-dialog-title"
      open={isIE}
    >
      <DialogTitle>
        <Typography variant="h6">Super Fun Retro</Typography>
        <IconButton className={classes.closeButton} onClick={closeIEDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Hi there!
          <p>
            I noticed you are using IE and I wanted to let you know that in my
            opinion, you can do better. I care about your experience and you
            should know that using IE is not Super Fun. Life is too short to be
            stuck in a relationship with a terrible browser. So do yourself a
            favor and go get a better one because you deserve it!
          </p>
          <p>
            But hey, nobody should force you to make a decision. So if you want
            to use IE go ahead! But I can't guarantee you will have a positive
            experience using Super Fun Retro. When you are ready to make that
            move to a better browser, Super Fun Retro will be ready for you with
            open arms!
          </p>
          With much love from your friend,
          <br />
          Brady
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default IEWarning;
