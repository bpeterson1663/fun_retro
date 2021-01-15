import React from 'react'
import EditCommentDialog from '../EditCommentDialog'
import { render } from '@testing-library/react'
import userEvent from "@testing-library/user-event";

it('EditCommentDialog Renders', () => {
  const { getByTestId } = render(
    <EditCommentDialog
      editCommentHandler={jest.fn()}
      handleCommentClose={jest.fn()}
      editComment={{ i: 'idstring', item: 'item to be edited', originalComment: 'original comment' }}
    />,
  )

  const element = getByTestId('edit-comment').querySelector('textarea')
  expect(element.value).toEqual('original comment')
})
