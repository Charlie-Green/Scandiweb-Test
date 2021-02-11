import { CarouselParameters } from "./CarouselParameters.js"
import { correctIndex } from "./Carousel Util.js"


/* Resolves render data from SWITCH_INITIATED and SWITCHING states. */
export class CarouselSwitchResolver {

  constructor(params) {
    this.params = params
  }


  resolveSwitchInitiated(desiredSlide) {
    let curSlide = this.params.getSlideIndex()

    let result = {
      slideIndices: [],
      leftMargin: 0,
      animate: false,
      rerender: true
    }

    let slidesPerScreen = this.params.getSlidesPerScreen()

    // Below a formula is implemented.
    // This is the common formula obtained by merging multiple possible cases.
    let startSlide = Math.min(curSlide, desiredSlide)
    let endSlide = Math.max(curSlide, desiredSlide) + slidesPerScreen

    let indexOfCurrent
    for(let slide = startSlide; slide < endSlide; ++slide) {

      if(slide >= startSlide + slidesPerScreen &&
         slide < endSlide - slidesPerScreen ) {
        continue
      }

      if(slide === desiredSlide) {
        this.desiredIndex = result.slideIndices.length
      }
      else if(slide === curSlide) {
        indexOfCurrent = result.slideIndices.length
      }

      let correctSlide = correctIndex(slide, this.params.getTotalSlides())
      result.slideIndices.push(correctSlide)
    }

    result.leftMargin = -indexOfCurrent * this.params.getSlideWidth()

    return result
  }


  resolveSwitching() {
    return {
      slideIndices: this.params.getLastRenderData().slideIndices,
      leftMargin: -this.desiredIndex * this.params.getSlideWidth(),
      animate: true,
      rerender: false
    }
  }
}
