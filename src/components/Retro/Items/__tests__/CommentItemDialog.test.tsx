import React from 'react'
import CommentItemDialog from '../CommentItemDialog'
import { render } from '@testing-library/react'
import userEvent from "@testing-library/user-event";

it('CommentItemDialog Renders', () => {
  const { getByTestId } = render(<CommentItemDialog addComment={jest.fn()} handleCommentClose={jest.fn()} showCommentDialog={{ item: 'This is a test' }} />)

  userEvent.type(getByTestId('add-comment').querySelector('textarea'), 'This is a test comment')
  expect(getByTestId('add-comment').querySelector('textarea').value).toEqual('This is a test comment')
})
