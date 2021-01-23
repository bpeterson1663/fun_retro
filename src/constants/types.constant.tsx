import { columnKeys } from './columns.constants'
export interface RetroType {
  id: string
  name: string
  startDate: string
  endDate: string
  userId: string
  team: ManageTeamsType[]
  numberOfVotes: number
  columnsKey?: keyof typeof columnKeys
  isActive: boolean
  timestamp: number
}
export interface RetroTypeString {
  id: string
  name: string
  startDate: string
  endDate: string
  userId: string
  team: ManageTeamsType[]
  numberOfVotes: number
  columnsKey: string
  isActive: boolean
  timestamp: number
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
  userId: string
  emailList: { email: string }[]
}

export interface ActionItemType {
  id: string
  value: string
  retroId: string
  teamId: string
  retroName: string
  owner: string
  timestamp: number
  completed: boolean
  completedDate: string
}

export interface ActionItemTableProps {
  name: string
  data: ActionItemType[]
  retros: RetroType[]
  teams: ManageTeamsType[]
  tableUpdated: () => void
}

export interface ActionItemTable extends ActionItemTableProps {
  id: string
}

export type Order = 'asc' | 'desc'

export interface CommentT {
  value: string
  userId: string
}

export interface ItemT {
  id: string
  value: string
  retroId: string
  userId: string
  votes: number
  voteMap: string[]
  timestamp: number
  comments: CommentT[]
}
