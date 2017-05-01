import React, {Component} from 'react';

// Input array is an array of pages (array format), each page is an array of slides (objects)
// Each slide has a slide key with its render value and a relative duration (default should be 1)
// Pages transition by sliding, slides do a sharp transition


// returns current slide information based on position
export function Slide(position, slides, height, current={page: null, slide: null}){
  let pageIndex = getPageIndex(slides, height, position),
    slideIndex = getSlideIndex(pageIndex, slides, height, position),
    pageOff = pageOffset(pageIndex, slides, height),
    slideOff = slideOffset(slideIndex, slides[pageIndex], height),
    slideDuration = getSlideDuration(slides, pageIndex, slideIndex),
    percent = getPercent(position, height, slideDuration, slideIndex, slideOff, pageOff),
    relative = (current.page == pageIndex && current.slide == slideIndex) ? "current" :
      (current.page < pageIndex || (current.page == pageIndex && current.slide < slideIndex)) ? "after" : "before"

  return {
    pageIndex: pageIndex,
    slideIndex: slideIndex,
    pageOffset: pageOff,
    slideOffset: slideOff,
    slideDuration: slideDuration,
    percent: percent,
    relative: relative
  }
}

// get percentage through current slide
export function getPercent(currentPos, slideHeight, slideDuration=1, slide=0, slideOffset=0, pageOffset=0){
  return Math.floor((((currentPos-pageOffset-slideOffset-(slide*slideHeight))/(slideHeight*slideDuration)+0.01))*100)
}

// get total slides
export function totalSlides(slides){
  return slides.reduce((a, b) => { return a + b.reduce((a, b)=>{return a + 1}, 0) }, 0)
}

// get total duration
export function totalDuration(slides){
  return slides.reduce((a, b) => { return a + b.reduce((a, b)=>{return a + b.duration}, 0) }, 0)
}

// progress bar for current slide
export class Progress extends Component {
  constructor(props){
    super(props)
  }

  render(){
    const {percent, width, height, bgcolor, color, style, text} = this.props
    return (<div style={{...style, width: width}}>
      <span style={{height: height, display: "block", background: bgcolor, color: color, width: `${percent}%`}}>{text ? `${percent}%` : null}</span>
    </div>)
  }
}

Progress.defaultProps = {
  width: "100vw",
  height: 50,
  bgcolor: "#000",
  color: "#fff",
  style: {},
  text: false
}

// new page offset
export function pageOffset(index, array, height){
  return (array.slice(0, index).reduce((a,b)=>{return a + b.length+(b.reduce((a,b)=>a+b.duration,0) - b.length)},0) * height) + array.slice(0, index).length * height
}

// slide duration offset (for slides with previous slides over 1 default duration)
export function slideOffset(slideIndex, array, height){
  return (array.slice(0, slideIndex).reduce((a,b)=>{return a + b.duration-1},0)*height)
}

// current page
export function getPageIndex(array, height, position){
  let accumulation = 0
  let pageindex = 0

  array.map((pages)=>{
    let pageheight = pages.length * height + (pages.reduce((a,b)=>a+b.duration,0) - pages.length)*height + height
    accumulation = accumulation += pageheight
    return {start: accumulation-pageheight, end: accumulation-1}
  }).forEach((page, index)=>{
    if (position >= page.start && position <= page.end){
      pageindex = index
    }
  })
  return pageindex
}

// current slide on current page
export function getSlideIndex(pageIndex, array, height, position){
  let structure=[]
  array[pageIndex].forEach((slide, index)=>{
    Array(slide.duration).fill(index).map((ind)=>{
      structure.push(ind)
    })
  })
  let start = pageOffset(pageIndex, array, height)
  let realIndex = Math.floor((position-start)/height)
  return realIndex <= 0 ? 0 : realIndex < structure.length ? structure[realIndex] : structure[structure.length-1]
}

// number of slides in a page
export function getNumSlides(array, pageIndex){
  return array[pageIndex].length
}

// height of page, taking duration into account
export function getPageHeight(array, pageIndex, height){
  return getPageDuration(array, pageIndex) * height
}

// height of document
export function getDocHeight(array, height){
  return (totalDuration(array) + array.length) * height - 1
}

// total duration of page for all slides
export function getPageDuration(array, pageIndex){
  return array[pageIndex].reduce((a,b)=>a + b.duration, 0)
}

// get a slide's duration
export function getSlideDuration(array, pageIndex, slideIndex){
  return array[pageIndex][slideIndex].duration
}

// https://gist.github.com/andjosh/6764939
// smooth scrolling
export function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time, b = start value, c = change in value, d = duration
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

// info
export class InfoProgress extends Component{
  render(){
    const {slides, position, height} = this.props
    let singleSlide = height
    let pageIndex = getPageIndex(slides, height, position)
    let numslides = getNumSlides(slides, pageIndex)
    let pageheight = getPageHeight(slides, pageIndex, singleSlide)
    let slide = getSlideIndex(pageIndex, slides, singleSlide, position)
    let percent = getPercent(position, singleSlide, getSlideDuration(slides, pageIndex, slide), slide, slideOffset(slide, slides[pageIndex], singleSlide), pageOffset(pageIndex, slides, singleSlide))

    return <div className="info" style={{zIndex: 1000, position: "fixed", bottom: 20, left: 20, padding: 10}}>
          <p style={{padding: 0, margin: 0}}>Slides: {numslides}</p>
          <p style={{padding: 0, margin: 0}}>Doc height: {pageheight}</p>
          <p style={{padding: 0, margin: 0}}>Slide height: {singleSlide}</p>
          <p style={{padding: 0, margin: 0}}>Current Page: {pageIndex}</p>
          <p style={{padding: 0, margin: 0}}>Current Slide: {slide}</p>
          <p style={{padding: 0, margin: 0}}>Percent: {percent}</p>
          <p style={{padding: 0, margin: 0}}>current: {position}</p>
        </div>
  }
}

export class Navigation extends Component{
  render(){
    const {slides, position, height} = this.props

    return (
      <div>
        {slides.map((page, index, array)=>{
          return <div>
            {page.map((slide, index)=>{
              return (<span>
                <button>{index}</button>
              </span>)
            })}
          </div>
        })}
      </div>
    )
  }
}

// export scrolling divs
export class Scrolling extends Component{
  constructor(){
    super()

    this.state={
      position: 0,
      height: window.innerHeight
    }
  }

  componentWillMount(){
    window.addEventListener('scroll',(e)=>{
      this.setState({
        position: window.scrollY
      })
    })

    window.addEventListener('resize', (e)=>{
      this.setState({
        height: window.innerHeight
      })
    })
  }

  docHeight(){
    let duration = this.props.slides.reduce((a, b) => { return a + b.reduce((a, b)=>{return a + b.duration}, 0) }, 0)
    return (duration + this.props.slides.length) * this.state.height - 1
  }

  pageHeight(pageIndex){
    return this.props.slides[pageIndex].reduce((a,b)=>a + b.duration, 0) * this.state.height
  }

  pageOffset(pageIndex){
    return (this.props.slides.slice(0, pageIndex).reduce((a,b)=>{return a + b.length+(b.reduce((a,b)=>a+b.duration,0) - b.length)},0) * this.state.height) + this.props.slides.slice(0, pageIndex).length * this.state.height
  }

  getSlideIndex(pageIndex){
    let structure=[]
    this.props.slides[pageIndex].forEach((slide, index)=>{
      Array(slide.duration).fill(index).map((ind)=>{
        structure.push(ind)
      })
    })
    let start = this.pageOffset(pageIndex)
    let realIndex = Math.floor((this.state.position-start)/this.state.height)
    return realIndex <= 0 ? 0 : realIndex<structure.length ? structure[realIndex] : structure[structure.length-1]
  }

  render(){
    const {slides} = this.props
    const {position, height} = this.state

    return(
      <div style={{height: this.docHeight()}}>
        {slides.map((page, index, array)=>{
          let pageHeight = this.pageHeight(index)
          let start = this.pageOffset(index)
          let end = start + pageHeight
          let currentIndex = this.getSlideIndex(index)

          //styles
          let fixStyle = {position: "fixed", top: 0, height: height, padding: 0, margin: 0}
          let beforeStyle = {position: "absolute", top: start, height: height, padding: 0, margin: 0}
          let afterStyle = {position: "absolute", top: end, height: height, padding: 0, margin: 0}

          return(
            <div className="scroll" key={index} style={position < start ? beforeStyle : position <= end ? fixStyle : afterStyle}>
              {page.map((slide, index, array)=>{
                if (index===currentIndex){
                  return <div key={index} className="main" style={{margin: 0, padding: 0}}>
                    {slide.slide}
                  </div>
                }
              })}
          </div>
          )
        })}
      </div>
    )
  }
}
