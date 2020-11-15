const $green = '#009588',
  $red = '#E91D63',
  $purple = '#9C28B0',
  $blue = '#2196F3'

export const columnKeys = {
  keepDoing: [
    { title: 'Keep Doing', value: 'keepDoing', backgroundColor: $green },
    { title: 'Stop Doing', value: 'stopDoing', backgroundColor: $red },
    { title: 'Start Doing', value: 'startDoing', backgroundColor: $purple },
  ],
  mad: [
    { title: 'Mad', value: 'mad', backgroundColor: $red },
    { title: 'Sad', value: 'sad', backgroundColor: $purple },
    { title: 'Glad', value: 'glad', backgroundColor: $green },
  ],
  liked: [
    { title: 'Liked', value: 'liked', backgroundColor: $green },
    { title: 'Learned', value: 'learned', backgroundColor: $purple },
    { title: 'Lacked', value: 'lacked', backgroundColor: $red },
    { title: 'Longed For', value: 'longedFor', backgroundColor: $blue },
  ],
  whatWentWell: [
    { title: 'What Went Well', value: 'whatWentWell', backgroundColor: $green },
    { title: 'What Did Not Go Well', value: 'whatDidNotGoWell', backgroundColor: $red },
  ],
  keep: [
    { title: 'Keep', value: 'keep', backgroundColor: $blue },
    { title: 'Add', value: 'add', backgroundColor: $purple },
    { title: 'Less', value: 'less', backgroundColor: $red },
    { title: 'More', value: 'more', backgroundColor: $green },
  ],
  toDo: [
    { title: 'To Do', value: 'toDo', backgroundColor: $blue },
    { title: 'Doing', value: 'doing', backgroundColor: $purple },
    { title: 'Done', value: 'done', backgroundColor: $green },
  ],
  sailboat: [
    { title: 'Anchors (What Weighed Us Down)', value: 'anchor', backgroundColor: $red },
    { title: 'Gusts of Wind (What Pushed Us Forward)', value: 'gust', backgroundColor: $green },
  ],
}

export const columnTitles = [
  { value: 'keepDoing', title: 'Keep Doing, Stop Doing, Start Doing' },
  { value: 'mad', title: 'Mad, Sad, Glad' },
  { value: 'liked', title: 'Liked, Learned, Lacked, Longed For' },
  { value: 'whatWentWell', title: 'What Went Well, What Did Not Go Well' },
  { value: 'keep', title: 'Keep, Add, Less, More' },
  { value: 'toDo', title: 'To Do, Doing, Done' },
  { value: 'sailboat', title: 'Sailboat' },
]

export const getColumnsTitle = key => {
  if (!key) return 'Keep Doing, Stop Doing, Start Doing'
  const result = columnTitles.find(columns => columns.value === key)
  return result.title
}
