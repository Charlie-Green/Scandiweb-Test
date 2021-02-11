import React from "react"
import { CarouselDot } from "./CarouselDot.jsx"
import "./CarouselDot.css"


export const CarouselDots = (props) => {
  let dots = []
  while(dots.length < props.dotCount) {
    let newDot = (
      <CarouselDot
        slideIndex={dots.length}
        selected={dots.length === props.selectedIndex}
        size={props.dotSize}
        onSelect={props.onSelect} />
    )

    dots.push(newDot)
  }

  let w = (props.dotSize + 6)*props.dotCount
  let h = props.dotSize - 4


  return(
    <div style={{ width: w, height: h }}
         className="dots" >

      {dots}

    </div>
  )
}
