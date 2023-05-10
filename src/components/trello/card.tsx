import { FC } from 'react'

export interface CardProps {
  name: string
  tag: string
  deadline: string
  description: string
}

const Card: FC<CardProps> = ({ name, tag, deadline, description }) => {
  const isFeature = tag.toLowerCase() === 'feature'
  const isBug = tag.toLowerCase() === 'bug'

  let tagColor: string
  if (isFeature) {
    tagColor = 'bg-green-500'
  } else if (isBug) {
    tagColor = 'bg-red-500'
  } else {
    tagColor = 'bg-gray-200'
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <span className={`inline-block rounded-lg text-white px-3 py-1 mb-4 text-sm font-semibold ${tagColor}`}>{tag}</span>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <span className="text-gray-600 text-sm">Deadline: {deadline}</span>
    </div>
  )
}

export default Card
