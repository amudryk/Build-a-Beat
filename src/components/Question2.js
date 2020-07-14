import React, {Component} from 'react';
import {Link} from "react-router-dom";
//import slider2D from "./slider2D";
import Slider from "./slider";

class Question2 extends Component {
  render() {
    return (
      <div>
        <div style={{textAlign: "center"}} >
          <h1>Adjust Your Music</h1>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Slider label1="slower" label2="faster"/>
            <Slider label1="calmer" label2="busier"/>
            <Slider label1="lower" label2="higher"/>
          </div>
          <button className="next">
            <Link
              to={{
                pathname: "/selection",
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

export default Question2;