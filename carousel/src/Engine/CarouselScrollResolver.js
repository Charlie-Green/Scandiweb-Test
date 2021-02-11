import { CarouselParameters } from "./CarouselParameters.js"
import { correctIndex } from "./Carousel Util.js"


/* Resolves render data from SCROLLING and AFTER_SCROLL states. */
export class CarouselScrollResolver {

  constructor(params) {
    this.params = params

    /* When Carousel enteres SCROLLING state, rendered slides
       are resolved and memorised, until it goes to AFTER_SCROLL state. */
    this.cachedSlides = null
  }


  notifyScrollStarting(x, leftMargin) {
    // Offset of the first rendered slide:
    let relativeOffset = -leftMargin/this.params.getSlideWidth()

    // (Absolute) Index of the first rendered slide:
    let firstSlide = this.params.getLastRenderData().slideIndices[0]

    // Absolute offset = Absolute index + Relative offset
    let absoluteOffset = firstSlide + relativeOffset

    this.params.setOffset(absoluteOffset)

    // Convert pixels to slide-widths
    x /= this.params.getSlideWidth()
    this.cachedSlides = initCache(this, x)
  }


  resolveScrolling() {
    let offset = this.params.getOffset() - this.firstSlide
    return {
      slideIndices: this.cachedSlides,
      leftMargin: -offset*this.params.getSlideWidth(),
      animate: false,
      rerender: false
    }
  }


  resolveAfterScroll() {
    if(this.cachedSlides == null) {
      return null
    }

    let offset = this.params.getOffset() - this.firstSlide
    let desiredOffset = Math.round(offset)

    let data = {
      slideIndices: this.cachedSlides,
      leftMargin: -desiredOffset*this.params.getSlideWidth(),
      animate: true,
      rerender: false
    }

    this.params.setOffset( Math.round(this.params.getOffset()) )
    this.params.normalizeOffset()
    this.cachedSlides = null

    return data
  }
}


function initCache(resolver, x) {
  let params = resolver.params
  let slidesPerScreen = params.getSlidesPerScreen()

  resolver.firstSlide = Math.floor(params.getOffset() - (slidesPerScreen-x))
  let endSlide = Math.ceil(params.getOffset() + slidesPerScreen + x)
  if(!params.doesInfiniteScroll()) {
    resolver.firstSlide = Math.max(resolver.firstSlide, 0)
    endSlide = Math.min(endSlide, params.getTotalSlides())
  }

  let slides = []
  for(let slide = resolver.firstSlide; slide < endSlide; ++slide) {
    slides.push( correctIndex(slide, params.getTotalSlides()) )
  }

  return slides
}
