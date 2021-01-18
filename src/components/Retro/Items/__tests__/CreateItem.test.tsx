import React from 'react'
import CreateItem from '../CreateItem'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('CreateItem Renders', () => {
  const columnType = 'keepDoing'
  const { getByTestId } = render(<CreateItem columnName={columnType} isActive={true} itemSubmit={jest.fn()} />)
  userEvent.type(getByTestId(`column-${columnType}-textfield`).querySelector('textarea'), 'Creating an Item')
  expect(getByTestId(`column-${columnType}-textfield`).querySelector('textarea').value).toEqual('Creating an Item')
  userEvent.click(getByTestId(`column-${columnType}-addButton`))
})
