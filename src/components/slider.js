import React, {Component} from 'react';
import '../styles/slider.css';

class slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 50
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div style={{display: "flex", width: "90%", margin: "40px 0px"}}>
        <h2>{this.props.label1}</h2>
        <div class="slidecontainer">
          <input style={{margin: "10px 0px"}}type="range" min="1" max="100" value={this.state.value} onChange={this.handleChange} class="slider" id="myRange"/>
        </div>
        <h2 style={{marginTop: "0"}}>{this.props.label2}</h2>
      </div> 
    );
  }
}

export default slider;