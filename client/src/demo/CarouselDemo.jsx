import React from "react"
import { Carousel } from "churun-carousel/Carousel.jsx"
import { CarouselSlideData } from "churun-carousel/Slide/CarouselSlideData.js"
import { CarouselParametersPanel } from "../params/CarouselParametersPanel.jsx"
import { SlidesStorage } from "./SlidesStorage.jsx"
import "./demo.css"


export class CarouselDemo extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      infiniteScroll: false,
      slidesPerScreen: 2
      /* Dimensions are added later. */
    }

    this.slidesStorage = new SlidesStorage()
    this.slidesStorage.setOnRemoveSlideListener((index) => {
      this.slidesStorage.removeSlide(index)
      this.setState(this.state)  // Rerender
    })

    updateDimensions(this, false)   // Create state and set initial dimensions.
    window.addEventListener("resize", () => {
      updateDimensions(this, true)  // Update dimensions in the existing state.
    })

    this.onAddSlideRequested = (slideText) => {
      this.slidesStorage.addSlide(slideText)
      this.setState(this.state)  // Rerender
    }
    this.onInfiniteScrollChange = (infiniteScroll) => {
      this.state.infiniteScroll = infiniteScroll
      this.setState(this.state)  // Rerender
    }
    this.onSlidesPerScreenChange = (number) => {
      this.state.slidesPerScreen = number
      this.setState(this.state)  // Rerender
    }
  }


  render() {
    let state = this.state

    return(
      <div className="rootContainer"
           style={{ width: state.width }} >
        <Carousel
          ref={this.carouselRef}
          width={state.width}
          height={state.height}
          slides={this.slidesStorage.getSlides()}
          slidesPerScreen={this.state.slidesPerScreen}
          infiniteScroll={this.state.infiniteScroll} />

        <CarouselParametersPanel
          onAddSlide={this.onAddSlideRequested}
          onInfiniteScrollChange={this.onInfiniteScrollChange}
          onSlidesPerScreenChange={this.onSlidesPerScreenChange} />
      </div>
    )
  }
}


function updateDimensions(component, rerender) {
  let state = component.state

  let dims = dimensionsFixedAspect(
    window.innerWidth - 20,
    window.innerHeight - 140,
    2.0
  )
  state.width  = dims.width
  state.height = dims.height

  if(rerender) {
    component.setState(state)
  } else {
    component.state = state
  }
}


/* Choose dimensions based on the given maximum width and height
   so to preserve the specified aspect (aspect = width / height). */
function dimensionsFixedAspect(maxWidth, maxHeight, aspect) {
  if(maxWidth > aspect*maxHeight) {
    return {
      width: aspect*maxHeight,
      height: maxHeight
    }
  }

  return {
    width: maxWidth,
    height: maxWidth/aspect
  }
}
