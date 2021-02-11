export function correctIndex(index, totalSlides) {
  while(index < 0) {
    index += totalSlides
  }
  while(index >= totalSlides) {
    index -= totalSlides
  }

  return index
}
