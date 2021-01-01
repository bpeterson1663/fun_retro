import React from 'react'

const authContext = React.createContext({
  userId: '',
  login: () => {
    return
  },
})

export default authContext
