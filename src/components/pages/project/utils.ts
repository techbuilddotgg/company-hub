export const reorderElements = <T extends { orderIndex: number }>(
  arr: T[],
  currentIndex: number,
  targetIndex: number,
) => {
  const [removed] = arr.splice(currentIndex, 1);
  if (removed) arr.splice(targetIndex, 0, removed);
  for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    if (element) {
      element.orderIndex = i;
      arr[i] = element;
    }
  }
};
