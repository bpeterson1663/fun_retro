export const columnKeys = {
  keepDoing: [
    { title: 'Keep Doing', value: 'keepDoing', backgroundColor: '#009588' },
    { title: 'Stop Doing', value: 'stopDoing', backgroundColor: '#E91D63' },
    { title: 'Start Doing', value: 'startDoing', backgroundColor: '#9C28B0' },
  ],
  mad: [
    { title: 'Mad', value: 'mad', backgroundColor: '#E91D63' },
    { title: 'Sad', value: 'sad', backgroundColor: '#9C28B0' },
    { title: 'Glad', value: 'glad', backgroundColor: '#009588' },
  ],
  liked: [
    { title: 'Liked', value: 'liked', backgroundColor: '#009588' },
    { title: 'Learned', value: 'learned', backgroundColor: '#9C28B0' },
    { title: 'Lacked', value: 'lacked', backgroundColor: '#E91D63' },
    { title: 'Longed For', value: 'longedFor', backgroundColor: '#2196f3' },
  ],
  whatWentWell: [
    { title: 'What Went Well', value: 'whatWentWell', backgroundColor: '#009588' },
    { title: 'What Did Not Go Well', value: 'whatDidNotGoWell', backgroundColor: '#E91D63' },
  ],
}

export const columnTitles = [
  { value: 'keepDoing', title: 'Keep Doing, Stop Doing, Start Doing' },
  { value: 'mad', title: 'Mad, Sad, Glad' },
  { value: 'liked', title: 'Liked, Learned, Lacked, Longed For' },
  { value: 'whatWentWell', title: 'What Went Well, What Did Not Go Well' },
]

export const getColumnsTitle = key => {
  if (!key) return 'Keep Doing, Stop Doing, Start Doing'
  const result = columnTitles.find(columns => columns.value === key)
  return result.title
}
