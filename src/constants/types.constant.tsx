export interface RetroType {
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
  userId: string
}

export interface ActionItemType {
  id: string
  value: string
  retroId: string
  teamId: string
  retroName: string
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
