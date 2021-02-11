import { CarouselEngine } from "./Engine/CarouselEngine.js"
import { CarouselSlide } from "./Slide/CarouselSlide.jsx"
import { CarouselDots } from "./Dot/CarouselDots.jsx"
import "./Carousel.css"
import React from "react"


export class Carousel extends React.Component {
  // ============================================================================
  // Constructor:

  constructor(props) {
    console.log("New carousel!")
    super(props)

    this.engine = new CarouselEngine()
    this.rootRef = React.createRef()
    this.firstSlideRef = React.createRef()

    this.onScrollStart = (event) => {
      let leftMargin = getLeftMarginAnimatedValue(this.firstSlideRef)
      let cursorX = x(this, event)

      let rerender = this.engine.handleScrollStart(cursorX, leftMargin)
      if(rerender) {
        this.setState({  })
      }
    }
    this.onScrollMove = (event) => {
      let rerender = this.engine.handleScrollMove( x(this, event) )
      if(rerender) {
        this.setState({  })
      }
    }
    this.onScrollEnd = () => {
      let rerender = this.engine.handleScrollEnd()
      if(rerender) {
        this.setState({  })
      }
    }

    this.onSlideSelected = (index) => {
      let requestId = this.engine.handleSwitch(index)
      if(requestId === 0) {
        return
      }

      this.setState({  })  // Rerender.

      // In 2 seconds switch animation will finish,
      // which the engine must be notified of to function properly.
      setTimeout(() => {
        let rerender = this.engine.notifySwitchFinished(requestId)
        if(rerender) {
          this.setState({  })
        }
      }, 1500)
    }
  }


  // ============================================================================
  // Render:

  render() {
    let slides = getSlides(this.props)
    let w = getWidth(this.props)
    let slidesPerScreen = getSlidesPerScreen(this.props)

    // The actual number of slides per screen may differ.
    // The method returns the real number of slides per screen.
    slidesPerScreen = this.engine.setCurrentParameters(
      w,
      slidesPerScreen,
      slides.length,
      this.props.infiniteScroll || false
    )

    let dotSize = getDotSize(this.props)
    let h = getHeight(this.props, dotSize)

    let data = this.engine.resolveRenderData()

    // Actual number of slides per screen may differ from the desired number.
    let slideWidth = w/slidesPerScreen

    let view = (
      <div ref={this.rootRef}
           style={{ width: w + "px" }}>
        <div style={{ width: "100%", height: h }}
             className="carousel"

             onMouseDown={this.onScrollStart}
             onMouseMove={this.onScrollMove}
             onMouseUp={this.onScrollEnd}
             onMouseLeave={this.onScrollEnd}
             onTouchStart={this.onScrollStart}
             onTouchMove={this.onScrollMove}
             onTouchEnd={this.onScrollEnd}
             onTouchCancel={this.onScrollEnd} >

          {
            data.slideIndices.map((unused, index) => (
              slideComponent(
                this,
                data,
                index,
                slides,
                slideWidth
              )
            ))
          }

        </div>

        {
          (this.props.dotsEnabled === false) ? ([]) : (
            <CarouselDots
              dotSize={dotSize}
              onSelect={this.onSlideSelected}
              selectedIndex={data.slideIndex}
              dotCount={slides.length} />
          )
        }
      </div>
    )

    if(data.rerender === true) {
      setTimeout(() => {
        this.setState({  })
      }, 80)
    }

    return view
  }
}


// ============================================================================
// Help Functions (Get Parameter X):

function getSlides(props) {
  return props.slides || []
}

function getWidth(props) {
  let w = props.width
  if(w < 0) {
    throw new Error("Width cannot be negative, got " + w)
  }

  return w
}

function getSlidesPerScreen(props) {
  let count = props.slidesPerScreen
  if(count == undefined) {
    return 1
  }

  if(count < 0) {
    throw new Error(
      "Slides per screen number cannot be negative, got " +
      slidesPerScreen
    )
  }

  return count
}

function getDotSize(props) {
  if(props.dotsEnabled === false) {
    return 0
  }

  let h = props.dotSize
  if(h === undefined) {
    return 12
  }

  if(h < 0) {
    throw new Error("Dot size cannot be negative, got " + h)
  }
  return h
}

function getHeight(props, dotSize) {
  let fullHeight = props.height || 200
  if(dotSize == 0) {
    return fullHeight
  }

  return fullHeight - dotSize - 10
}


// ============================================================================
// Help Functions (Render):


function slideComponent(
  component,
  renderData,
  renderIndex,
  slideDatas,
  width ) {

  let slideIndex = renderData.slideIndices[renderIndex]

  return(
    <CarouselSlide
      rootRef={ (renderIndex === 0) ? (component.firstSlideRef) : (undefined) }
      number={slideIndex+1}
      width={width}
      leftMargin={(renderIndex === 0) ? (renderData.leftMargin) : (0)}
      animateMargin={renderIndex === 0 && renderData.animate}
      data={slideDatas[slideIndex]} />
  )
}


// ============================================================================
// Help Functions (Other):

function x(carousel, event) {
  let cursorX = (event.touches) ?
    (event.touches[0].clientX) : (event.clientX)

  let carouselElement = carousel.rootRef.current
  let carouselX = carouselElement.getBoundingClientRect().left

  return cursorX - Math.floor(carouselX)
}


function getLeftMarginAnimatedValue(slideRef) {
  let slide = slideRef.current
  if(slide == null) {
    return 0
  }

  let compstyle = window.getComputedStyle(slide)
  let marginStr = compstyle.getPropertyValue("margin-left")
  return parseInt(
    // Remove "px" or "em" in the end:
    marginStr.substring(0, marginStr.length - 2)
  )
}
