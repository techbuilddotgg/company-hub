import React from 'react'
import Card, {CardProps} from './card'
import { Droppable } from 'react-beautiful-dnd';


interface ColumnProps {
  name: string
  cards: CardProps[]
  onAddCard: () => void
  id: string
}

const Column: React.FC<ColumnProps> = ({ name, cards, onAddCard, id }) => {
  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4 mr-4">
      <h2 className="text-lg font-bold mb-4">{name}</h2>
      <Droppable droppableId={id}>
        {provided => (
          <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
            {cards.map((card) => (
              <Card key={card.id}  {...card} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className="text-gray-400 px-4 py-2 mt-4" onClick={onAddCard}>+ Add Card</button>
    </div>
  )
}

export default Column
