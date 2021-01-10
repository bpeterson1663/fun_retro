import '@testing-library/dom'
import React from 'react'
import { render } from '@testing-library/react'
import ShowLinkDialog from '../ShowLinkDialog'

test('show link dialog should render', () => {
  render(
    <ShowLinkDialog
      retroLink={{
        name: 'Test Retro',
        startDate: '2020-01-01',
        endDate: '2020-01-15',
        numberOfVotes: 6,
        id: 'MroWInV20rxNENup0Caq',
        userId: 'MroWIner0rxMENup0Caq',
        team: [],
        columnsKey: 'keepDoing',
        isActive: true,
        timestamp: 1610316195,
      }}
      handleShowLinkClose={() => {}}
      showLinkStatus={true}
    />,
  )
})
