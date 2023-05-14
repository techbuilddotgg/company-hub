export const reorderElements = <T>(
  arr: T[],
  currentIndex: number,
  targetIndex: number,
) => {
  const [removed] = arr.splice(currentIndex, 1);
  if (removed) arr.splice(targetIndex, 0, removed);
};
