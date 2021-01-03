import { db } from '../firebase'
import { QuerySnapshot, DocumentSnapshot } from '@firebase/firestore-types'
import { ActionItemType } from '../constants/types.constant'
export const getAllRetros = async (id: string): Promise<QuerySnapshot> =>
  db
    .collection('retros')
    .where('userId', '==', id)
    .get()

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

export const getActionItemsByRetro = async (id: string): Promise<QuerySnapshot> =>
  await db
    .collection('actionItems')
    .where('retroId', '==', id)
    .get()

export const deleteActionItem = async (id: string): Promise<void> =>
  await db
    .collection('actionItems')
    .doc(id)
    .delete()

export const editActionItemById = async (id: string, item: ActionItemType): Promise<void> =>
  await db
    .collection('actionItems')
    .doc(id)
    .update(item)

export const getRetroById = async (id: string): Promise<DocumentSnapshot> =>
  await db
    .collection('retros')
    .doc(id)
    .get()
