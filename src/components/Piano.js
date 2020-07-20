import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as Tone from "tone"; 
import PlayPause from "./PlayPause.js";

class Piano extends Component{
  constructor() {
    super();
    this.PlayPause = PlayPause;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getBpm = 120;
  
  // track1 = {
  //   notes: [
  //     [0, "C4"], 
  //     ["0:2", "C5"], 
  //     ["0:3:2", "G4"]
  //   ],
  // };

  // track2 = {
  //   notes: [
  //     [0, "G3"], 
  //     ["0:2", "F2"], 
  //     ["0:3:2", "G4"]
  //   ],
  // };

  // track3 = {
  //   notes: [
  //     [0, "D3"], 
  //     ["0:2", "D3"], 
  //     ["0:3:2", "A4"]
  //   ],
  // };

  track1 = {
    notes: [
      ["0", "C4"], 
      ["0:2", "C5"], 
      ["0:3:2", "G4"]
    ],
  };

  track2 = {
    notes: [
      ["0", "G3"],
      ["0:0:2", "D3"], 
      ["0:1", "F3"], 
      ["0:2", "G4"],
      ["0:3", "D3"],
    ],
  };

  track3 = {
    notes: [
      ["0", "D4"], 
      ["0:1", "D4"], 
      ["0:2:1", "A4"],
      ["0:2:2", "C4"],
      ["0:3", "A4"]
    ],
  };

  selectedMelody = this.track1;
  part = new Tone.Part();

  synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    }
  }).toMaster()

  play = (melody) => {
    this.part.dispose();   
    Tone.Transport.bpm.value = this.getBpm;
    Tone.Transport.toggle();

    this.part = new Tone.Part(
      (time, note) => {
      this.synth.triggerAttackRelease(note, "8n", time);
    }, this.selectedMelody.notes)

    this.part.loop = true;
    this.part.start();
  };

  pause = () => {
    Tone.Transport.stop();
    console.log("paused");
  };

  setMelody = (melody) => {
    this.selectedMelody = melody;
  };

  changeBpm = (value) => {
    Tone.Transport.bpm.value = value;
    this.getBpm = value;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data.get("bpm"));
    this.getBpm = data.get("bpm");
    this.changeBpm(this.getBpm);
  };

  render() {
    return(
      <div>
        <h1>Select a Piano Track</h1>
        <form onSubmit={this.handleSubmit}>

          <label htmlFor="bpm">Tempo (44-200)</label>
          <input id="bpm" name="bpm" type="number" />

          <button onClick={this.pause}>Confirm Parameters</button>
        </form>
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.track1}
          setBeat={this.setMelody}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.track2}
          setBeat={this.setMelody}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.track3}
          setBeat={this.setMelody}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />

        <button onClick={this.pause}>
          <Link
            to={{
              pathname: "/selection",
            }}
          >
            Next
          </Link>
        </button>
      </div>
    );
  }


}

export default Piano;