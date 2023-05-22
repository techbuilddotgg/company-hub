export const getTaskTypeBackgroundColor = (type: string): string => {
  switch (type) {
    case 'feature':
      return 'bg-green-500';
    case 'bug':
      return 'bg-red-500';
    case 'chore':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export const getTaskPriorityBackgroundColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return 'bg-red-700';
    case 'high':
      return 'bg-orange-600';
    case 'medium':
      return 'bg-yellow-300';
    case 'low':
      return 'bg-gray-300';
    default:
      return 'bg-gray-500';
  }
};
