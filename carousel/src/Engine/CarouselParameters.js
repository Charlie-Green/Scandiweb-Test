/* Slides are just displayed without being moved anywhere. */
export const CAROUSEL_STATE_STABLE = 0

/* The user is scrolling the carousel. */
export const CAROUSEL_STATE_SCROLLING = 1

/* The user has stopped scrolling the carousel and it's being animated to stable state. */
export const CAROUSEL_STATE_AFTER_SCROLL = 2

/* Slide switch has been requested.
   Carousel in this state looks the same as in stable state,
   but some hidden slides are rendered to make animation possible.
   After Carousel is rendered, it comes into SWITCHING state. */
export const CAROUSEL_STATE_SWITCH_INITIATED = 3

/* Switch has been requested
   and the Carousel is being animated to the desired slide. */
export const CAROUSEL_STATE_SWITCHING = 4


/* Holds Carousel's parameters that engine needs
   to correctly resolve rendered slides. */
export class CarouselParameters {

  constructor() {
    /* Either of CAROUSEL_STATE_* constants. */
    this.state = CAROUSEL_STATE_STABLE

    /* Total number of slides. */
    this.totalSlides = 0

    /* Last render data resolved by the engine and returned back to the UI. */
    this.lastRendered = null

    /* Carousel's width. */
    this.width = 0

    /* The number the caller wants to be the number of slides
       displayed to the user at the same time. However,
       the real slidesPerScreen is limited by totalCount. */
    this.slidesPerScreen = 1

    /* Scroll progress, measured in slide width,
       relative to the left edge of slide 0.  */
    this.offset = 0.0

    /* Whether infinite scrolling is enabled. */
    this.infiniteScroll = false
  }


  getState() {
    return this.state
  }

  setState(value) {
    this.state = value
  }


  getCarouselWidth() {
    return this.width
  }

  setCarouselWidth(value) {
    this.width = value
  }


  getTotalSlides() {
    return this.totalSlides
  }

  setTotalSlides(value) {
    this.totalSlides = value
    if(value === 0) {
      this.state = CAROUSEL_STATE_STABLE
    }
  }


  getSlidesPerScreen() {
    return Math.min(this.slidesPerScreen, this.totalSlides)
  }

  setSlidesPerScreen(value) {
    this.slidesPerScreen = value
  }


  getSlideWidth() {
    return this.width / this.getSlidesPerScreen()
  }


  getOffset() {
    return this.offset
  }

  getSlideIndex() {
    return normalizeOffset( Math.round(this.offset), this )
  }

  setOffset(value) {
    this.offset = value
  }

  normalizeOffset() {
    this.offset = normalizeOffset(this.offset, this)
  }

  addOffsetPixels(value) {
    this.offset += value / this.getSlideWidth()
  }


  doesInfiniteScroll() {
    return this.infiniteScroll
  }

  setInfiniteScroll(value) {
    this.infiniteScroll = value
  }


  getLastRenderData() {
    return this.lastRendered
  }

  rememberRenderData(data) {
    this.lastRendered = data
  }
}


function normalizeOffset(offset, params) {
  if(params.totalSlides === 0) {
    return 0
  }

  if(params.infiniteScroll) {
    while(offset < 0) {
      offset += params.totalSlides
    }
    while(offset >= params.totalSlides) {
      offset -= params.totalSlides
    }
  } else {
    let maxOffset = params.totalSlides - params.getSlidesPerScreen()
    offset = Math.max(0, Math.min(offset, maxOffset))
  }

  return offset
}
