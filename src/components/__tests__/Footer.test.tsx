import React from 'react'
import Footer from '../Common/Footer'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

it('Footer Loads', () => {
  render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>,
  )
})
