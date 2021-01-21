import React from 'react'
import CreateActionItemDialog from '../CreateActionItemDialog'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect'

it('Create Action Item Dialog', async () => {
  const { getByText, getByTestId } = render(
    <CreateActionItemDialog
      showActionItemDialog={true}
      handleActionItemDialogClose={() => {return}}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createActionItem={(item: {value: 'new item', team: [], retroId: 'retroId', owner: 'myself', timestamp: 1234556}) => {return}}
      team={[]}
      retros={[]}
    />,
  )
  
  expect(getByText('Create Action Item')).toBeInTheDocument()

  userEvent.type(getByTestId('create_action_item').querySelector('textarea'), 'Creating an Item')
  expect(getByTestId('create_action_item').querySelector('textarea').value).toEqual('Creating an Item')
  
  userEvent.type(getByTestId('owner_action_item').querySelector('input'), 'Myself')
  expect(getByTestId('owner_action_item').querySelector('input').value).toEqual('Myself')
})
