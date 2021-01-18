import React from 'react'

const voteContext = React.createContext({
  votes: 6,
  setRemainingVotes: (votes: number) => {
    return votes
  },
})

export default voteContext
