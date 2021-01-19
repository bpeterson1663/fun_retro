import React from 'react'
import EditCommentDialog from '../EditCommentDialog'
import { render } from '@testing-library/react'

it('EditCommentDialog Renders', () => {
  const { getByTestId } = render(
    <EditCommentDialog
      editCommentHandler={jest.fn()}
      handleCommentClose={jest.fn()}
      editComment={{
        i: 123,
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
        originalComment: 'original comment',
      }}
    />,
  )

  const element = getByTestId('edit-comment').querySelector('textarea')
  expect(element.value).toEqual('original comment')
})
