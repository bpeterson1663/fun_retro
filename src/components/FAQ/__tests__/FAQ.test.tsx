import React from 'react'
import FAQ from '../FAQ'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

it('Colomn Renders', () => {
  const { getByText } = render(
    <FAQ
      history={{
        goBack: () => {
          return
        },
      }}
    />,
  )

  expect(getByText('FAQ')).toBeInTheDocument()
})
