import { correctIndex } from "./Carousel Util.js"


/* Resolves render data in STABLE state. */
export class CarouselStableResolver {

  constructor(params) {
    this.params = params
  }


  empty() {
    return {
      slideIndices: [],
      leftMargin: 0,
      animate: false,
      rerender: false
    }
  }

  resolve() {
    let slides = []
    let firstSlide = this.params.getSlideIndex()
    for(let slide = firstSlide;
        slide < firstSlide + this.params.getSlidesPerScreen();
        ++slide) {
      slides.push( correctIndex(slide, this.params.getTotalSlides()) )
    }

    return {
      slideIndices: slides,
      leftMargin: 0,
      animate: false,
      rerender: false
    }
  }
}
