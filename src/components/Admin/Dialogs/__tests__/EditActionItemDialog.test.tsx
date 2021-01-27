import '@testing-library/dom'
import React from 'react'
import { render } from '@testing-library/react'
import EditActionItemDialog from '../EditActionItemDialog'

test('should render the edit action item dialog', () => {
  const { getByTestId } = render(
    <EditActionItemDialog
      editStatus={true}
      handleEditActionClose={() => {
        return
      }}
      teams={[]}
      editActionItem={() => {
        return
      }}
      item={{
        id: 'testId',
        value: 'Action Item Value',
        retroId: 'retroid',
        teamId: 'teamId',
        retroName: 'Retro Name',
        owner: 'Myself',
        timestamp: 434564234,
        completed: true,
        completedDate: '2020-12-31',
      }}
    />,
  )
  const element = getByTestId('action-item_edit').querySelector('textarea')
  expect(element.value).toEqual('Action Item Value')
})
