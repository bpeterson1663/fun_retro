import React from 'react'
import CreateItem from '../CreateItem'
import { render } from '@testing-library/react'

it('CreateItem Renders', () => {
  render(<CreateItem columnName={'keepDoing'} isActive={true} itemSubmit={jest.fn()} />)
})
