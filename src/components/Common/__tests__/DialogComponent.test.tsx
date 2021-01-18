import * as React from 'react'
import { render, screen } from '@testing-library/react'
import DialogComponent from '../DialogComponent'
import '@testing-library/jest-dom'
test('should render dialog', () => {
  const { getByTestId } = render(
    <DialogComponent
      open={true}
      onClose={() => {
        return false
      }}
      title="Test Dialog"
      actions={[<button key={0}>Action</button>, <button key={1}>Close</button>]}
    >
      Dialog Content
    </DialogComponent>,
  )
  expect(getByTestId('dialog_component')).toBeTruthy()
  expect(screen.getByText('Dialog Content')).toBeInTheDocument()
})
