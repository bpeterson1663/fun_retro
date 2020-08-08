import React from 'react'
import CreateItem from '../CreateItem'
import { render } from '@testing-library/react'

it('CreateItem Renders', () => {
  render(<CreateItem isActive={true} itemSubmit={jest.fn()} />)
})
