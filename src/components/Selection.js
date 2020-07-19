import React, { Component } from "react";
import "../App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as Tone from "tone";

import { generatePopulation,DNA } from "./genetic_a.js";

import PlayPause from "./PlayPause.js";

class Selection extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.PlayPause = PlayPause;
  }
  getBpm = 120;
  getPitch = 44;
  getBeatDensity = 0.7;
  selectedBeat;
  
  //TODO: Decide on these values
	mutationRate = 1;		// Mutation rate
	totalPopulation = 100;	// Total population
  generations = 10;		// Number of generations between updates
  numBeats = 16;
  instruments1 = [1,1,1];
  beat_density1 = Array(this.instruments1.length).fill(25)
  beats1 = Array(this.instruments1.length).fill(Array(this.numBeats).fill(0));

	get_from_UI = 0;	// Placeholder

  // Target defined by the user parameters
  // TODO: Figure out how to get the things from UI
  target = {
    beats:this.beats1,
    tempo:this.get_from_UI,			// [10,200]
    beat_density:this.beat_density1,	// [0,100]
    instruments:this.instruments1,
    pitch:this.get_from_UI,			// [44,100]
    attack:this.get_from_UI,			// [0,1]
    delay:this.get_from_UI,			// [0,4]
  }

  // Empty 
  empty = {
    beats:this.beats1,
    tempo:this.get_from_UI,	// [10,200]
    beat_density:[],	// [0,100]
    instruments:this.instruments1,
    pitch:0,			// [44,100]
    attack:0,			// [0,1]
    delay:0,			// [0,4]
    fitness:0
  }
	
	population = generatePopulation(this.totalPopulation, this.numBeats, this.empty)
	
	rando = DNA(this.numBeats, this.empty)
	
	state = {
    steps: this.rando.beats,
    bpm: this.rando.tempo,
    notes: ["A", "C#", "E", "F#"],
    column: 0,
    activeColumn: 0,
    time: 0,
    masterVolume: 0,
    kickDrumTuning: this.getPitch,
    closedHihatDecayLevel: 0,
    mediaRecorderState: false,
  }
	
	
	// Start state at random then evolve every time regenerate is clicked
  // state = {
  //   steps: [
  //     [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  //     [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  //     [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0],
  //   ],
  //   bpm: this.getBpm,
  //   notes: ["A", "C#", "E", "F#"],
  //   column: 0,
  //   activeColumn: 0,
  //   time: 0,
  //   masterVolume: 0,
  //   kickDrumTuning: this.getPitch,
  //   closedHihatDecayLevel: 0,
  //   mediaRecorderState: false,
  // };

  /// INIT SYNTHS & FX ///

  // create master volume for App
  appVol = new Tone.Volume();

  // create pingpong delay for snare
  pingPong = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.32,
    wet: 0, // wet level can be modified by user via the snaredelayknob
  });

  // create compressor for kick
  kickComp = new Tone.Compressor(-30, 2);

  // kick
  kick = new Tone.MembraneSynth({
    volume: 0,
    pitchDecay: 0.032,
    octaves: 6,
    oscillator: {
      type: "square4",
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.01,
      release: 0.75,
    },
  }).chain(this.kickComp, this.appVol, Tone.Master);

  // snare
  snare = new Tone.NoiseSynth({
    volume: -8.3,
    noise: {
      type: "pink",
    },
    envelope: {
      attack: 0.002,
      decay: 0.21,
      sustain: 0.05,
    },
  }).chain(this.pingPong, this.appVol, Tone.Master);

  // hihat
  closedHihat = new Tone.MetalSynth({
    volume: -58,
    frequency: 150,
    envelope: {
      attack: 0.002,
      decay: 0.25,
      release: 0.025,
    },
    harmonicity: 4.1,
    modulationIndex: 40,
    resonance: 2000,
    octaves: 1,
  }).chain(this.appVol, Tone.Master);

  play = (beat) => {
    Tone.Transport.bpm.value = this.selectedBeat.bpm;
    Tone.Transport.toggle();
  };

  pause = () => {
    Tone.Transport.stop();
    console.log("paused");
  };

  setBeat = (beat) => {
    this.selectedBeat = beat;
  };

  changeBpm = (value) => {
    Tone.Transport.bpm.value = value;

    this.setState({
      bpm: value,
    });
  };

  changeKickDrumTuning = (value) => {
    this.setState({
      kickDrumTuning: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data.get("bpm"));
    console.log(data.get("pitch"));
    this.getBpm = data.get("bpm");
    this.getPitch = data.get("pitch");
    this.changeBpm(this.getBpm);
    this.changeKickDrumTuning(this.getPitch);
  };

  componentDidMount() {
    this.loop = new Tone.Sequence(
      (time, col) => {
        this.setState({
          column: col,
        });

        this.selectedBeat.steps.map((row, noteIndex) => {
          if (row === this.selectedBeat.steps[0] && row[col]) {
            // randomised velocities (volume of each triggered note)
            let vel = Math.random() * 0.5 + 0.5;
            // Trigger the sound to be played here

            return this.kick.triggerAttackRelease(
              this.selectedBeat.kickDrumTuning,
              "16n",
              time,
              vel
            );
          } else if (row === this.selectedBeat.steps[2] && row[col]) {
            let vel = Math.random() * 0.45 + 0.45;
            this.snare.triggerAttackRelease("16n", time, vel);
          } else if (row === this.selectedBeat.steps[1] && row[col]) {
            // let vel = Math.random() * 0.5 + 0.5;
            this.closedHihat.triggerAttackRelease("16n", time, -12);
          }
        });

        // Tone.Draw.schedule(() => {
        //   this.backgroundDisco()
        // }, "16n", time);
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // or this.state.steps[0].map((_, i) => i) -
      "16n"
    ).start(0);

    this.setState({
      masterVolume: this.appVol.volume.value,
    });
    return () => this.loop.dispose();
  }

  render() {
    return (
      <React.Fragment>
        <h2>Select your preferred rhythm</h2>
        <div>{this.rando.beats[0]}</div>
        <div>{this.rando.beats[1]}</div>
        <div>{this.rando.beats[2]}</div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="pitch">Pitch (10-100)</label>
          <input id="pitch" name="pitch" type="number" />

          <label htmlFor="bpm">Tempo (44-200)</label>
          <input id="bpm" name="bpm" type="number" />

          <label htmlFor="beatDensity">Beat Density (1-100)</label>
          <input id="beatDensity" name="beatDensity" type="number" />

          <button onClick={this.pause}>Confirm Parameters</button>
        </form>
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.state}
          setBeat={this.setBeat}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
		<button onClick={this.pause}>
          <Link
            to={{
              pathname: "/editor",
              aboutProps: {
                state: this.selectedBeat,
              },
            }}
          >
            Regenerate
          </Link>
        </button>
        <button onClick={this.pause}>
          <Link
            to={{
              pathname: "/editor",
              aboutProps: {
                state: this.selectedBeat,
              },
            }}
          >
            Next
          </Link>
        </button>
      </React.Fragment>
    );
  }
}

export default Selection;
