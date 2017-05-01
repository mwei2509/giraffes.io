import React, { Component } from 'react';
import './scroll.css'

class Scroll extends Component {
  constructor(){
    super()
    this.state={
      position: 0
    }
  }

  componentWillMount(){
    window.addEventListener('scroll',(e)=>{
      this.setState({
        position: window.scrollY
      })
    })
  }

  render() {
    const slides = [
      //part 1
      [
        {slide: <div><h1>Hello!</h1><p>Welcome to this demo.  <br />Keep scrolling down to see the page transition.</p></div>},
        {slide: <div><h1>Oh look!</h1><p>What have we here?  A second page?  Keep going...</p></div>},
        {slide: <div><h1>Finally</h1><p>We have reached our destination... or have we?</p></div>}
      ],
      //part 2
      [
        {slide: <div><h1>Ha, tricked you<p>I'm another div!</p></h1></div>},
        {slide: <div><h1>Div 2<p>I'm another div!</p></h1></div>}
      ],
      //part 3
      [
        {slide: <div><h1>SECTION 3<p>I'm another div!</p></h1></div>},
        {slide: <div><h1>Div 3<p>I'm another div!</p></h1></div>},
        {slide: <div><h1>Div 4<p>I'm another div!</p></h1></div>},
        {slide: <div><h1>Div 5<p>I'm another div!</p></h1></div>},
        {slide: <div><h1>LAST DIV PROMISE<p>I'm another div!</p></h1></div>}
      ]
    ]
      const singleSlide = window.innerHeight
      const totalSlides = slides.reduce((acc, cur) => { return acc + cur.reduce((acc, cur)=>{return acc + 1}, 0) }, 0)

      var cumulativeIndex=0
      return (
        <div style={{height: (totalSlides + slides.length)*singleSlide-1}}>
          { slides.map((page, index, array)=>{
            let numslides = slides[index].length
            let docHeight = singleSlide * numslides //current height

            //relative when BEFORE and AFTER, fixed DURING
            let start = index > 0 ? (array.slice(0, index).reduce((a,b)=>{return a + b.length},0) * singleSlide) + array.slice(0, index).length * singleSlide: 0
            let end = start + docHeight

            let realIndex = Math.floor((this.state.position-start)/singleSlide)
            let currentIndex = realIndex < 0 ? 0 : realIndex < numslides-1 ? realIndex : numslides-1 // window height * number of "pages"
            let percent = Math.floor((((this.state.position-start)/singleSlide+0.01)-currentIndex)*100)

            //styles
            let fixStyle = {position: "fixed", top: 0, height: singleSlide, background: `rgba(151,203,191,1)`}
            // let fixStyle = {position: "fixed", top: 0, height: singleSlide, background: `linear-gradient(180deg, #fff, rgba(151,203,191,${percent*0.01}))`}
            let afterStyle={position: "absolute", top: end, height: singleSlide, background: "rgba(151,203,191,1)"}
            let beforeStyle={position: "absolute", top: start, height: singleSlide, background: "rgba(151,203,191,1)"}

            return(
                <div key={index} className="scroll" height={docHeight} style={this.state.position < start ? beforeStyle : this.state.position < end ? fixStyle : afterStyle}>
                  {page.map((slide, index, array)=>{
                    cumulativeIndex = cumulativeIndex + 1

                    if (index==currentIndex){
                      return <div key={index} className="main" style={{height: singleSlide}}>
                        <h1>{cumulativeIndex}</h1>
                        {slide.slide}
                      </div>
                    }
                  })}
                  <div className="info" style={{position: "absolute", background: "#fff", bottom: 50, padding: 20, border: "1px solid #000"}}>
                    <p>Slides: {numslides}</p>
                    <p>Doc height: {docHeight}</p>
                    <p>Slide height: {singleSlide}</p>
                    <p>Page: {index}</p>
                    <p>Index: {currentIndex}</p>
                    <p>Percent: {percent}</p>
                    <p>current: {this.state.position}</p>
                  </div>
              </div>
            )
          })}
        </div>
    );
  }
}

export default Scroll;









// export function scrollPages(slides, position, windowheight){
//
//     const singleSlide = windowheight
//     let docheight = getDocHeight(slides, singleSlide)
//
//     return (
//       <div style={{height: docheight}}>
//         { slides.map((page, index, array)=>{
//
//           let pageHeight = getPageHeight(array, index, singleSlide) //current height
//
//           let start = pageOffset(index, array, singleSlide)
//           let end = start + pageHeight
//
//           let currentIndex = getSlideIndex(index, slides, singleSlide, position)
//
//           //styles
//           let fixStyle = {position: "fixed", top: 0, height: singleSlide}
//           let afterStyle={position: "absolute", top: end, height: singleSlide}
//           let beforeStyle={position: "absolute", top: start, height: singleSlide}
//
//           return(
//               <div className="scroll" key={index} height={pageHeight} style={position < start ? beforeStyle : position < end ? fixStyle : afterStyle}>
//                 {page.map((slide, index, array)=>{
//                   if (index===currentIndex){
//                     return <div key={index} className="main" style={{height: singleSlide}}>
//                       {slide.slide}
//                     </div>
//                   }
//                 })}
//             </div>
//           )
//         })}
//       </div>
//   )
// }
