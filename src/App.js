import React, { Component } from 'react';
import './App.css';

class TimerController extends Component {
  constructor(){
    super();

    this.handleBreakIncrement = this.handleBreakIncrement.bind(this)
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this)
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this)
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this)

  }

    handleBreakIncrement = () => {
      if(this.props.breakTime < 60){
        this.props.incrementBreakTime()
      }
    }
  
    handleBreakDecrement = () => {
      if(this.props.breakTime > 1){
        this.props.decrementBreakTime()
      }
    }
    handleSessionIncrement = () => {
      if(this.props.sessionTime < 60 ){
        this.props.incrementSessionTime()
      }
    }
  
    handleSessionDecrement = () => {
      if(this.props.sessionTime > 1){
        this.props.decrementSessionTime()
      }
    }
  
    render(){
      return(
        <div>
        <div id="break-label">
            <h3>Break Length</h3>
            <button id="break-increment" onClick={this.handleBreakIncrement}>+</button>
            <span id="break-length">{this.props.breakTime}</span>
            <button id="break-decrement" onClick={this.handleBreakDecrement}>-</button>
          </div>
          <div id="session-label">
            <h3>Session Length</h3>
            <button id="session-increment" onClick={this.handleSessionIncrement}>+</button>
            <span id="session-length">{this.props.sessionTime}</span>
            <button id="session-decrement" onClick={this.handleSessionDecrement}>-</button>
          </div>
          </div>
      )
    }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerId: 0,
      timerRunning: false,
      currentTime: 25,
      sessionTime: 25,
      breakTime: 5,
      cycle: "Session",
      timer: 1500,
    }
    this.incrementBreakTime = this.incrementBreakTime.bind(this)
    this.decrementBreakTime = this.decrementBreakTime.bind(this)
    this.incrementSessionTime = this.incrementSessionTime.bind(this)
    this.decrementSessionTime = this.decrementSessionTime.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.startTimer = this.startTimer.bind(this);
  }


  incrementSessionTime = () => {
    this.setState({
      sessionTime: this.state.sessionTime + 1,
      currentTime: this.state.sessionTime + 1,
      timer: this.state.sessionTime * 60
  })
}

  decrementSessionTime = () => {
    this.setState({
      sessionTime: this.state.sessionTime - 1,
      currentTime: this.state.sessionTime - 1,
      timer: this.state.sessionTime * 60
    })
  }

  incrementBreakTime = () => {
    this.setState({
      breakTime: this.state.breakTime + 1,
    })
  }

  decrementBreakTime = () => {
    this.setState({
      breakTime: this.state.breakTime - 1
    })
  }

  setSound(_timer) {
    if(_timer === 0){
      this.audioBeep.play();
    }
  }

  handleReset = () => {
    this.setState({
      currentTime: 25,
      sessionTime: 25,
      breakTime: 5,
      timer: 1500,
      timerRunning: false
    })
    this.stopTimer();
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
  
  clockify() {
    let minutes = Math.floor( this.state.timer / 60)
    let seconds = this.state.timer  - minutes * 60;
    seconds = seconds < 10 ? '0'+ seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
      return minutes + ':' + seconds
  }

  startTimer = () => {
     let clocktimer = setInterval(() => {
    if(this.state.timer > 0){
     this.clockify();
     this.setState({timer: this.state.timer - 1});
     this.setSound(this.state.timer);
     } else if (this.state.timer === 0){
       this.setState({
         timer: this.state.breakTime * 60,
        cycle: "Break"
        })
       this.clockify();
       this.setSound(this.state.timer);
     } 
    }, 1000);
  }

  stopTimer = () => {
    this.setState({timerRunning: false})
    clearInterval(this.startTimer)
  }

  handleToggle() {
    this.setState(prevState => ({
      timerRunning: !prevState.timerRunning
    }));
    if(this.state.timerRunning === false){
      this.startTimer(this.state.timer)
    }
    if(this.state.timerRunning === true) {
      this.stopTimer()
    }
  }

/*startTimer = (duration) => {
  this.setState({timerRunning: true})
  let time = duration * 60
  let minutes;
  let seconds;
    let runningTimer = setInterval(() =>{
      this.setState({timerId: runningTimer})
      minutes = Math.floor(time/60);
      seconds = time - minutes * 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      if(time == 0){
        if(this.state.cycle === "Session"){
          this.setState({
            cycle: "Break",
            timerRunning: false
          })
          clearInterval(this.state.timerId)
          this.startTimer(this.state.breakTime)
        }else{
          this.setState({
            cycle: "Session",
            timerRunning: false
          })
          clearInterval(this.state.timerId)
          this.startTimer(this.state.sessionTime)
        }
      }

    }, 1000);
  }*/
  
  render(){
    let {sessionTime, breakTime, currentTime, cycle, timerRunning} = this.state
    return (
      <div id="clock">
      <h4 className="header">Pomodoro Clock</h4>

        <div className="timer-controller">
        <TimerController 
         breakTime={breakTime}
         sessionTime = {sessionTime}
        incrementSessionTime = {this.incrementSessionTime}
        decrementSessionTime = {this.decrementSessionTime}
        incrementBreakTime = {this.incrementBreakTime}
        decrementBreakTime = {this.decrementBreakTime} />
        <div id="pomodoro" />

        <div id="timer-label">
         <div id="timer">
          <span>{cycle}</span>
          <br/>
          <br/>
          <span id="time-left" >
           {this.clockify()} 
           </span> 
  {/** If the timer is running, the element with the id of time-left should display the remaining time in mm:ss format (decrementing by a value of 1 and updating the display every 1000ms). */}
          <br/>
          <button id="reset" onClick={this.handleReset}>Reset</button>
  {/** When I click the element with the id of "reset", any running timer should be stopped,
 the value within id="break-length" should return to 5, the value within id="session-length"
 should return to 25, and the element with id="time-left" should reset to it's default state.
 */}
          <button id="start_stop" onClick={this.handleToggle}> {timerRunning ? 'Pause' : 'Start'} </button>
         </div>
        </div>
      </div>
      <audio id="beep" preload="auto" 
          src="https://goo.gl/65cBl1"
          ref={(audio) => { this.audioBeep = audio; }}></audio>
      <h6>Coded by: Adrian Murillo</h6>
      </div>
    );
  }
}

export default App;

