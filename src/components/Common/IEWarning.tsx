import React, { useState } from 'react'
import DialogComponent from './DialogComponent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
declare global {
  interface Document {
      documentMode?: unknown;
  }
}
localStorage.setItem
const IEWarning: React.FC = (): JSX.Element => {
  const [isIE, setIEState] = useState((false || !!document['documentMode']) && !localStorage.get('showIeDialog'))
  const closeIEDialog = () => {
    setIEState(false)
    localStorage.setItem('showIeDialog', 'true')
  }
  return (
    <DialogComponent
      onClose={closeIEDialog}
      open={isIE}
      title="Super Fun Retro"
      actions={
        <Button color="secondary" variant="outlined" onClick={closeIEDialog}>
          Close
        </Button>
      }
    >
      <Typography gutterBottom>
        Hi there!
        <p>
          I noticed you are using IE and I wanted to let you know that in my opinion, you can do better. I care about
          your experience and you should know that using IE is not Super Fun. Life is too short to be stuck in a
          relationship with a terrible browser. So do yourself a favor and go get a better one because you deserve it!
        </p>
        <p>
          But hey, nobody should force you to make a decision. So if you want to use IE go ahead! But I can&apos;t
          guarantee you will have a positive experience using Super Fun Retro. When you are ready to make that move to a
          better browser, Super Fun Retro will be ready for you with open arms!
        </p>
        With much love from your friend,
        <br />
        Brady
      </Typography>
    </DialogComponent>
  )
}

export default IEWarning
