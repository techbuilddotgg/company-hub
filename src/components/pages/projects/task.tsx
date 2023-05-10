import { FC } from 'react';
import { cn } from '@utils/classNames';

export enum Tag {
  FEATURE = 'feature',
  BUG = 'bug',
}

export interface TaskProps {
  name: string;
  tag: Tag;
  deadline: string;
  description: string;
}

const tagColor: Record<Tag, string> = {
  [Tag.FEATURE]: 'bg-green-500',
  [Tag.BUG]: 'bg-red-500',
};

export const Task: FC<TaskProps> = ({ name, tag, deadline, description }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <span
        className={cn(
          'mb-4 inline-block rounded-lg px-3 py-1 text-sm font-semibold text-white',
          tagColor[tag],
        )}
      >
        {tag}
      </span>
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mb-4 text-gray-700">{description}</p>
      <span className="text-sm text-gray-600">Deadline: {deadline}</span>
    </div>
  );
};
