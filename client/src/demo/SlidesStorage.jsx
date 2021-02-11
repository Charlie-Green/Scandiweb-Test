import React from "react"
import { CarouselSlideData } from "churun-carousel/Slide/CarouselSlideData.js"
import "./demo.css"


const slideColors = [
  "#f00000",
  "#00b000",
  "#0000b0",
  "#b0b000",
  "#00f0b0",
  "#f000f0"
]

let lastSlideKey = 0


export class SlidesStorage {

  constructor() {
    this.slides = [
      createDefaultSlide(this, "beach",  "HOT BEACHES",  "#fbf8f0"),
      createDefaultSlide(this, "drink",  "FRESH DRINKS", "#408010"),
      createDefaultSlide(this, "party",  "BEST PARTIES", "#f040b0"),
      createDefaultSlide(this, "more",   "AND MORE...",  "#d0c0c0")
    ]
  }


  getSlides() {
    return this.slides
  }

  addSlide(text) {
    let slide = createCustomSlide(this, text)
    this.slides.push(slide)
  }

  setOnRemoveSlideListener(listener) {
    this.onRemoveSlide = listener
  }

  removeSlide(index) {
    this.slides.splice(index, 1)
  }
}


function createDefaultSlide(
  storage, imageBaseName, slideText, textColor ) {

  let key = ++lastSlideKey
  let imagePath = "../../asset/slide-" + imageBaseName + ".jpg"

  let content = (
    <div
      className="generatedSlide"
      style={{
        background: "url(\"" + imagePath + "\") no-repeat",
        backgroundSize: "cover"
      }} >

      <p className="slideBigText"
         style={{ color: textColor }} >
        {slideText}
      </p>

      { createCloseButton(storage, key) }

    </div>
  )

  return new CarouselSlideData(key, content)
}

function createCustomSlide(storage, text) {
  let key = ++lastSlideKey
  let backColorIndex = key % slideColors.length
  let textColorIndex = (key + 1) % slideColors.length

  let content = (
    <div className="generatedSlide"
         style={{ backgroundColor: slideColors[backColorIndex] }} >

      <p className="slideAutoText">
        This is your custom slide with the following text:
      </p>

      <p className="slideBigText"
         style={{
           color: slideColors[textColorIndex],
           marginTop: "60px"
         }} >
        {text}
      </p>

      { createCloseButton(storage, key) }

    </div>
  )

  return new CarouselSlideData(key, content)
}

function createCloseButton(storage, key) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flexGrow: 1 }} />
      <div className="slideCloseButton"
           onClick={() => storage.onRemoveSlide(
             indexOfSlide(storage, key)
           )} />
    </div>
  )
}

function indexOfSlide(storage, key) {
  for(let index = 0; index < storage.slides.length; ++index) {
    let slideData = storage.slides[index]
    if(slideData.getKey() === key) {
      return index
    }
  }

  throw new Error("No slide for key " + key)
}
