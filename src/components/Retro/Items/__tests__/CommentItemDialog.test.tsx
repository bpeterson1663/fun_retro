import React from 'react'
import CommentItemDialog from '../CommentItemDialog'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('CommentItemDialog Renders', () => {
  const { getByTestId } = render(
    <CommentItemDialog
      addComment={jest.fn()}
      handleCommentClose={jest.fn()}
      showCommentDialog={{
        item: {
          retroId: 'retroId',
          value: 'value',
          id: 'id',
          userId: 'userId',
          votes: 6,
          timestamp: 13455,
          voteMap: [],
          comments: [],
        },
      }}
    />,
  )

  userEvent.type(getByTestId('add-comment').querySelector('textarea'), 'This is a test comment')
  expect(getByTestId('add-comment').querySelector('textarea').value).toEqual('This is a test comment')
})
