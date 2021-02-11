import React from "react"
import { useState } from "react"
import "./CarouselSlide.css"


export const CarouselSlide = (props) => {
  let marginStr = "0 0 0 " + props.leftMargin + "px"

  let classes = "slide"
  if(props.animateMargin) {
    classes += " animateMargin"
  }

  return(
    <div ref={props.rootRef}
         key={props.number}
         className={classes}
         style={{ width: props.width, margin: marginStr }} >
      { props.data.getContent() }
    </div>
  )
}
