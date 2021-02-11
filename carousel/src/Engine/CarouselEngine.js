import {
  CarouselParameters,
  CAROUSEL_STATE_STABLE,
  CAROUSEL_STATE_SCROLLING,
  CAROUSEL_STATE_AFTER_SCROLL,
  CAROUSEL_STATE_SWITCH_INITIATED,
  CAROUSEL_STATE_SWITCHING
} from "./CarouselParameters.js"
import { CarouselScrollResolver   } from "./CarouselScrollResolver.js"
import { CarouselSwitchResolver   } from "./CarouselSwitchResolver.js"
import { CarouselStableResolver } from "./CarouselStableResolver.js"


export class CarouselEngine {

  constructor() {
    this.params = new CarouselParameters()
    this.scrollResolver = new CarouselScrollResolver(this.params)
    this.switchResolver = new CarouselSwitchResolver(this.params)
    this.stableResolver = new CarouselStableResolver(this.params)

    /* Last wwitch request id to be returned.
       This is used to keep Carousel's behavior consistent in case of
       switch and scroll request overlapping each other. */
    this.switchRequestId = 1
  }


  /* Returns the actual number of slides per screen. */
  setCurrentParameters(
    width, slidesPerScreen, totalSlides, infiniteScroll ) {

    this.params.setCarouselWidth(width)
    this.params.setSlidesPerScreen(slidesPerScreen)
    this.params.setTotalSlides(totalSlides)
    this.params.setInfiniteScroll(infiniteScroll)

    return this.params.getSlidesPerScreen()
  }


  handleScrollStart(x, leftMargin) {
    if(this.params.getState() !== CAROUSEL_STATE_STABLE ||
      this.params.getTotalSlides() <= this.params.getSlidesPerScreen() ) {
      return false
    }

    this.x = x
    this.scrollResolver.notifyScrollStarting(x, leftMargin)
    this.params.setState(CAROUSEL_STATE_SCROLLING)
    return true
  }

  /* Returns whether Carousel must rerender itself. */
  handleScrollMove(x) {
    if(this.params.getState() !== CAROUSEL_STATE_SCROLLING) {
      return false
    }

    // If the pointer has left the area of carousel, the scroll ends:
    if(x < 0 || x > this.params.getCarouselWidth()) {
      return handleScrollEnd()
    }

    // If infinite scroll is disabled, we want the offset
    // to stay in its bounds. If enabled, it may exceed the bounds
    // (CarouselScrollResolver will handle it correctly);
    // it will be normalized when the Carousel is back to STABLE state.
    this.params.addOffsetPixels(this.x - x)
    if(!this.params.doesInfiniteScroll()) {
      this.params.normalizeOffset()
    }

    this.x = x

    return true
  }

  /* Returns whether Carousel must rerender itself. */
  handleScrollEnd() {
    if(this.params.getState() !== CAROUSEL_STATE_SCROLLING) {
      return false
    }

    this.params.setState(CAROUSEL_STATE_AFTER_SCROLL)
    return true
  }


  /* Returns a unique request ID to be passed to 'notifySwitchFinished'
     If switch didn't start, 0 is returned. */
  handleSwitch(index) {
    if(this.params.getState() !== CAROUSEL_STATE_STABLE ||
       this.params.getTotalSlides() < 2 ||
       this.params.getSlideIndex() === index ) {
      return 0
    }
    if(!this.params.doesInfiniteScroll() &&
       index + this.params.getSlidesPerScreen() > this.params.getTotalSlides() ) {
      return 0
    }

    this.params.setState(CAROUSEL_STATE_SWITCH_INITIATED)
    this.switchedSlide = index
    return ++this.switchRequestId
  }

  /* Returns whether Carousel must rerender itself. */
  notifySwitchFinished(requestId) {
    if(requestId === this.switchRequestId &&
       this.params.getState() === CAROUSEL_STATE_SWITCHING) {
      this.params.setState(CAROUSEL_STATE_STABLE)
      return true
    }

    return false
  }


  resolveRenderData() {
    let data = resolveRenderData(this) ||
      this.stableResolver.resolve()

    this.params.rememberRenderData(data)
    data.slideIndex = this.params.getSlideIndex()

    return data
  }
}


function resolveRenderData(eng) {
  if(eng.params.getTotalSlides() === 0) {
    return eng.stableResolver.empty()
  }

  let data

  switch(eng.params.getState()) {
    case CAROUSEL_STATE_SCROLLING:
      return eng.scrollResolver.resolveScrolling()

    case CAROUSEL_STATE_AFTER_SCROLL:
      data = eng.scrollResolver.resolveAfterScroll()
      eng.params.setState(CAROUSEL_STATE_STABLE)
      return data

    case CAROUSEL_STATE_SWITCH_INITIATED:
      data = eng.switchResolver.resolveSwitchInitiated(eng.switchedSlide)
      eng.params.setState(CAROUSEL_STATE_SWITCHING)
      return data

    case CAROUSEL_STATE_SWITCHING:
      data = eng.switchResolver.resolveSwitching()
      eng.params.setOffset(eng.switchedSlide)
      return data

    default:
      return eng.stableResolver.resolve()
  }
}
