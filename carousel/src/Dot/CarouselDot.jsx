import React from "react"
import "./CarouselDot.css"


export const CarouselDot = (props) => {
  let slideIndex = props.slideIndex
  let onSelect = (props.selected) ? (undefined) : (() => {
    props.onSelect(slideIndex)
  })

  let sz = props.size

  let classes = "dot"
  if(props.selected) {
    classes += " selected"
  }

  return(
    <div style={{ width: sz, height: sz - 4 }}
         className={classes}
         onClick={onSelect} />
  )
}
