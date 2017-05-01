import React, { Component } from 'react';
import Elephant from './components/elephant'
import Giraffe from './components/giraffe'
import Girl from './components/girl'
import SmokingGirl from './components/smokinggirl'
import Textfun from './components/textfun'
import './App.css';
import { Scrolling, InfoProgress, Slide, scrollTo, getDocHeight, getPercent, Progress} from './components/scrollfunction'

class App extends Component {
  constructor(){
    super()
    this.state={
      position: 0
    }
  }

  slides(){

    return [
      //part 1
      [
        {slide: null, duration: 6},
        {slide: null, duration: 8},
        {slide: null, duration: 8},
        {slide: null, duration: 8}
      ],
      //part 2
      [
        {slide: null, duration: 5}
      ],
      //part 3
      [
        {slide: <div><h1 style={{color: "#000"}}>SECTION 3<p>I'm another div!</p></h1></div>, duration: 1},
        {slide: <div><h1 style={{color: "#000"}}>Div 3<p>I'm another div!</p></h1></div>, duration: 2},
        {slide: <div><h1 style={{color: "#000"}}>Div 4<p>I'm another div!</p></h1></div>, duration: 1}
      ],
      [
        {slide: <div><h1 style={{color: "#000"}}>Div 5<p>I'm another div!</p></h1></div>, duration: 1},
        {slide: <div><h1 style={{color: "#000"}}>LAST DIV PROMISE<p>I'm another div!</p></h1></div>, duration: 1}
      ]
    ]
  }

  componentWillMount(){
    window.addEventListener('scroll',(e)=>{
      this.setState({
        position: window.scrollY
      })
    })
  }

  render() {
    // {scrollPages(this.slides(), this.state.position, window.innerHeight)}
    const slides = this.slides()

    slides[0][0].slide=<Giraffe height={window.innerHeight}
      position={this.state.position}
      percent={Slide(this.state.position, slides, window.innerHeight).percent}
      offset={Slide(this.state.position, slides, window.innerHeight).slideOffset} />
    slides[0][1].slide = <Elephant height={window.innerHeight}
      percent={Slide(this.state.position, slides, window.innerHeight).percent}
      position={this.state.position} />
    slides[0][2].slide = <Girl height={window.innerHeight}
      percent={Slide(this.state.position, slides, window.innerHeight).percent}
      position={this.state.position} />
    slides[0][3].slide = <SmokingGirl height={window.innerHeight}
      slide={Slide(this.state.position, slides, window.innerHeight, {page: 0, slide: 3})}
      position={this.state.position} />
    slides[1][0].slide = <Textfun height={window.innerHeight}
      slide={Slide(this.state.position, slides, window.innerHeight, {page: 1, slide: 0})}
      position={this.state.position} />
    // <Progress style={{zIndex: 200, position: "fixed", bottom: 0}}
    //   height={5}
    //   bgcolor="linear-gradient(130deg, yellow, green)"
    //   percent={getPercent(this.state.position, getDocHeight(slides, window.innerHeight))} />
    return (
      <div className="App">

        <InfoProgress slides={slides} position={this.state.position} height={window.innerHeight} />
        <Scrolling slides={slides}/>
      </div>
    );
  }
}

export default App;
