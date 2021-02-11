import React from "react"
import "./params.css"


const fancyColor = "#0040fb"


export class CarouselParametersPanel extends React.Component {
  constructor(props) {
    super(props)

    this.text = ""
    this.onTextChange = (event) => {
      this.text = event.target.value
    }

    this.onAddSlide = () => {
      if(this.text.length !== 0) {
        this.props.onAddSlide(this.text)
        this.text = ""
      }
    }

    this.infiniteScroll = false
    this.onInfiniteScrollChange = (event) => {
      let newInfiniteScroll = event.target.checked
      if(this.infiniteScroll !== newInfiniteScroll) {
        this.infiniteScroll = newInfiniteScroll
        this.props.onInfiniteScrollChange(newInfiniteScroll)
      }
    }

    this.slidesPerScreen = 2
    this.onSlidesPerScreenChange = (event) => {
      let slidesPerScreen = parseInt(event.target.value)
      slidesPerScreen = Math.max(1, Math.min(slidesPerScreen, 4))

      if(this.slidesPerScreen !== slidesPerScreen) {
        this.slidesPerScreen = slidesPerScreen
        this.props.onSlidesPerScreenChange(slidesPerScreen)
      }
    }
  }


  render() {
    return(
      <div style={{ width: "100%" }}>
        <div className="paramsRow" >
          <button
            className="addSlideButton"
            style={{ backgroundColor: fancyColor }}
            onClick={this.onAddSlide} >

            Add Slide

          </button>

          <input
            className="fancyInput"
            style={{
              color: fancyColor,
              border: "2px " + fancyColor + " solid"
            }}
            placeholder="Enter slide text here."
            onChange={this.onTextChange} />
        </div>

        <div className="paramsRow">
          <span className="slidesPerScreenLabel"
                style={{ color: fancyColor }}>
            Slides per screen (1 - 4):
          </span>
          <input className="fancyInput"
                 style={{
                   color: fancyColor,
                   borderColor: fancyColor
                 }}
                 type="number"
                 min={1} max={4}
                 onChange={this.onSlidesPerScreenChange}
                 value={this.slidesPerScreen} />

          <label className="checkContainer">
             <input
               type="checkbox"
               onClick={this.onInfiniteScrollChange} />
               <span className="checkSpan"
                     style={{ borderColor: fancyColor }}>
               </span>
               <span className="checkLabel"
                     style={{ color: fancyColor }}>
                 Infinite scroll
               </span>
            </label>
        </div>
      </div>
    )
  }
}
