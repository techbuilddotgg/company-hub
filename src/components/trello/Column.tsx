import React from 'react'
import Card, {CardProps} from './card'

interface ColumnProps {
  name: string
  cards: CardProps[]
  onAddCard: () => void
}

const Column: React.FC<ColumnProps> = ({ name, cards, onAddCard }) => {
  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4 mr-4">
      <h2 className="text-lg font-bold mb-4">{name}</h2>
      <div className="space-y-4">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <button className="text-gray-400 px-4 py-2 mt-4" onClick={onAddCard}>+ Add Card</button>
    </div>
  )
}

export default Column
