import React from 'react'
import EditCommentDialog from '../EditCommentDialog'
import { render } from '@testing-library/react'

it('EditCommentDialog Renders', () => {
  render(
    <EditCommentDialog
      editCommentHandler={jest.fn()}
      handleCommentClose={jest.fn()}
      editComment={{ i: null, item: {}, originalComment: '' }}
    />,
  )
})
