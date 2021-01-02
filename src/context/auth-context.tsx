import React from 'react'

const authContext = React.createContext({
  userId: '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: (status: string) => {
    return
  },
})

export default authContext
