import React from 'react'
import SnackBar from '../SnackBar'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

test('should render snack bar correctly', () => {
  const { getByText } = render(
    <SnackBar
      open={true}
      onClose={() => {
        return
      }}
      message="This was a success"
      status="success"
    />,
  )
  expect(getByText('This was a success')).toBeInTheDocument()
})
