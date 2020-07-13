import React, { Component } from "react";

  let style = {
    fontSize: "60px",
    marginTop: "0.6rem",
    marginLeft: "2.9rem",
    fontFamily: 'courier new',
    color: "black",
    border: "black",
    textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
    position: "relative"
  }

class Title extends Component {

  render() {

    return (
      <h1 style={style}> Edit your beats </h1>
    );

  }
}

export default Title
