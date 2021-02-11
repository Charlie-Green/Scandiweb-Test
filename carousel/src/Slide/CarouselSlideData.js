/** Defines and holds data that Carousel needs to render 1 slide.
    It only contains data individual for each slide. **/
export class CarouselSlideData {

  constructor(key, content) {
    this.key = key
    this.content = content
  }


  getKey() {
    return this.key
  }

  getContent() {
    return this.content
  }
}
