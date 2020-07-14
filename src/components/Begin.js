import React, {Component} from 'react';
import {Link} from "react-router-dom";
import '../styles/Begin.css';


class Begin extends Component {
  render() {
    return (
      <div class="start">
        <h1 class="title">Build-a-Beat</h1>
        <button class="begin">
          <Link
            to={{
              pathname: "/selection",
            }}
          >
            <h1>LET’S BEGIN!</h1>
          </Link>
        </button>
      </div>
    );
  }
}

export default Begin;