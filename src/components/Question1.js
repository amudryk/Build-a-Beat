import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../styles/Question1.css';


class Question1 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      angry: false,
      excited: false,
      sad: false,
      calm: false
    };

    this.handleAngry = this.handleAngry.bind(this);
    this.handleExcited = this.handleExcited.bind(this);
    this.handleSad = this.handleSad.bind(this);
    this.handleCalm = this.handleCalm.bind(this);
  }

  handleAngry() {
    this.setState({
      angry: !this.state.angry,
      excited: false,
      sad: false,
      calm: false
    });
  }

  handleExcited() {
    this.setState({
      excited: !this.state.excited,
      angry: false,
      Sad: false,
      calm: false,
    });
  }

  handleSad() {
    this.setState({
      sad: !this.state.sad,
      excited: false,
      angry: false,
      calm: false
    });
  }

  handleCalm() {
    this.setState({
      calm: !this.state.calm,
      excited: false,
      angry: false,
      sad: false
    });
  }

  render() {
    console.log(this.state);

    let angryStyle = this.state.angry ? "angry select" : "angry"
    let excitedStyle = this.state.excited ? "excited select" : "excited"
    let sadStyle = this.state.sad ? "sad select" : "sad"
    let calmStyle = this.state.calm ? "calm select" : "calm"

    return (
      <div>
        <div style={{textAlign: "center"}}>
          <h1>Pick a mood to start with:</h1>
          <div className={angryStyle} onClick={this.handleAngry}>
            <h1>Angry</h1>
          </div>
          <div className={excitedStyle} onClick={this.handleExcited}>
            <h1>Excited</h1>
          </div>
          <div className={sadStyle} onClick={this.handleSad}>
            <h1>Sad</h1>
          </div>
          <div className={calmStyle} onClick={this.handleCalm}>
            <h1>Calm</h1>
          </div>
          <button className="next">
            <Link
              to={{
                pathname: "/question2",
              }}
            >
              <h1 style={{color: "#FFFFFF"}}>Next</h1>
            </Link>
          </button>
        </div>
      </div>
    );
  }
}

export default Question1;
