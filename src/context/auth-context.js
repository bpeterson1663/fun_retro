import React from 'react'

const authContext = React.createContext({ userId: '', login: () => {} })

export default authContext
