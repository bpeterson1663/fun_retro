import React from 'react'

const voteContext = React.createContext({
  votes: 6,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRemainingVotes: (_votes: number) => {
    return
  },
})

export default voteContext
