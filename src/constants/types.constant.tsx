export interface RetroType {
  name: string
  startDate: string
  endDate: string
  userId: string
  numberOfVotes: number
  columnsKey: string
  isActive: boolean
  timestamp: number
  previousRetro: string
}

export interface PreviousRetroType {
  id: string
  name: string
  timestamp: number
}

export interface ManageTeamsType {
  teamName: string
  id: string
  timestamp: number
}
