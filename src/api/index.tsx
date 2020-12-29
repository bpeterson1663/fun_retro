import { db } from '../firebase'
import { QuerySnapshot } from '@firebase/firestore-types'

export const getActionItemsByUser = async (id: string): Promise<QuerySnapshot> =>
  await db
    .collection('actionItems')
    .where('teamId', '==', '')
    .where('userId', '==', id)
    .get()

export const getTeams = async (userId: string): Promise<QuerySnapshot> =>
  await db
    .collection('teams')
    .where('userId', '==', userId)
    .get()

export const getActionItemsByTeam = async (id: string): Promise<QuerySnapshot> =>
  await db
    .collection('actionItems')
    .where('teamId', '==', id)
    .get()
