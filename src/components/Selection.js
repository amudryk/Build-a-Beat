import React, { Component } from "react";
import "../App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as Tone from "tone";

import { generatePopulation, DNA, updateGA } from "./genetic_a.js";

import PlayPause from "./PlayPause.js";
import Regenerate from "./Regenerate.js";

class Selection extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.PlayPause = PlayPause;
  }
  getBpm = 120;
  getPitch;
  getBeatDensity = 0.7;
  selectedBeat;

	mutationRate = 1;		// Mutation rate
	totalPopulation = 100;	// Total population
  generations = 10;		// Number of generations between updates
  numBeats = 16;
  instrumentsInit = [1,1,1];  // Active instruments. Should be set from the Quiz
  beatDensityInit = new Array(this.instrumentsInit.length).fill(14);  // Preferred beat density. Should be from the Quiz
  stepsInit = new Array(this.instrumentsInit.length).fill(Array(this.numBeats).fill(0));  // Empty array of beats
  populationInit = generatePopulation(this.totalPopulation, this.numBeats, this.instrumentsInit, this.stepsInit);

  stateGA = {
    population: this.populationInit,
    targetBeatDensity: this.beatDensityInit,
  }

  state1 = {
    steps: this.stateGA.population[0],
    bpm: this.getBpm,
    notes: ["A", "C#", "E", "F#"],
    column: 0,
    activeColumn: 0,
    time: 0,
    masterVolume: 0,
    kickDrumTuning: 44,
    closedHihatDecayLevel: 0.25,
    wetLevel: 0.55,
    mediaRecorderState: false,
  };

  state2 = {
    steps: this.stateGA.population[1],
    bpm: this.getBpm,
    notes: ["A", "C#", "E", "F#"],
    column: 0,
    activeColumn: 0,
    time: 0,
    masterVolume: 0,
    kickDrumTuning: 90,
    closedHihatDecayLevel: 0.5,
    wetLevel: 0,
    mediaRecorderState: false,
  };

  state3 = {
    steps: this.stateGA.population[2],
    bpm: this.getBpm,
    notes: ["A", "C#", "E", "F#"],
    column: 0,
    activeColumn: 0,
    time: 0,
    masterVolume: 0,
    kickDrumTuning: 30,
    closedHihatDecayLevel: 0.8,
    wetLevel: 0.75,
    mediaRecorderState: false,
  }

  selectedBeat = this.state1;

  //average between state1,2,3
  currentBeatParams = {
    wetLevel:
      (this.state1.wetLevel + this.state2.wetLevel + this.state3.wetLevel) / 3,
    closedHihatDecayLevel:
      (this.state1.closedHihatDecayLevel + this.state2.closedHihatDecayLevel + this.state3.closedHihatDecayLevel) / 3,
    kickDrumTuning:
      (this.state1.kickDrumTuning + this.state2.kickDrumTuning + this.state3.kickDrumTuning) / 3,
  };

  /// INIT SYNTHS & FX ///

  // create master volume for App
  appVol = new Tone.Volume();

  // create pingpong delay for snare
  pingPong = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.32,
    wet: this.selectedBeat.wetLevel, // wet level can be modified by user via the snaredelayknob
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
      decay: this.selectedBeat.closedHihatDecayLevel,
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
    this.pingPong.wet.value = beat.wetLevel;
  };

  changeBpm = (value) => {
    Tone.Transport.bpm.value = value;

    this.state1.bpm = value;
    this.state2.bpm = value;
    this.state3.bpm = value;
  };

  changeKickDrumTuning = (value) => {
    this.state1.kickDrumTuning = value;
    this.state2.kickDrumTuning = value;
    this.state3.kickDrumTuning = value;
  };

  updateBeats = (newBeatParams) => {
    this.pause();
    this.state1.wetLevel = newBeatParams[0].wetLevel;
    this.state1.closedHihatDecayLevel = newBeatParams[0].closedHihatDecayLevel;
    this.state1.kickDrumTuning = newBeatParams[0].kickDrumTuning;

    this.state2.wetLevel = newBeatParams[1].wetLevel;
    this.state2.closedHihatDecayLevel = newBeatParams[1].closedHihatDecayLevel;
    this.state2.kickDrumTuning = newBeatParams[1].kickDrumTuning;

    this.state3.wetLevel = newBeatParams[2].wetLevel;
    this.state3.closedHihatDecayLevel = newBeatParams[2].closedHihatDecayLevel;
    this.state3.kickDrumTuning = newBeatParams[2].kickDrumTuning;

    //update currentBeatParams
    this.currentBeatParams = {
      wetLevel:
        (this.state1.wetLevel + this.state2.wetLevel + this.state3.wetLevel) / 3,
      closedHihatDecayLevel:
        (this.state1.closedHihatDecayLevel + this.state2.closedHihatDecayLevel + this.state3.closedHihatDecayLevel) / 3,
      kickDrumTuning:
        (this.state1.kickDrumTuning + this.state2.kickDrumTuning + this.state3.kickDrumTuning) / 3,
    };
  };

  updateBeatPatterns = () => {
    var newVals = updateGA(this.stateGA.population, this.stateGA.targetBeatDensity, this.mutationRate, this.numBeats);
    this.state1.steps = newVals[0];
    this.state2.steps = newVals[1];
    this.state3.steps = newVals[2];
    this.stateGA.population = newVals[3];
    console.log(this.state1.steps);
    this.selectedBeat = this.state1;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data.get("bpm"));
    console.log(data.get("pitch"));
    this.getBpm = data.get("bpm");
    this.getPitch = data.get("pitch");
    this.changeBpm(this.getBpm);
    this.changeKickDrumTuning(this.selectedBeat.kickDrumTuning);
  };

  componentDidMount() {
    this.loop = new Tone.Sequence(
      (time, col) => {
        this.state1.column = col;
        this.state2.column = col;
        this.state3.column = col;

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

    this.state1.masterVolume = this.appVol.volume.value;
    this.state2.masterVolume = this.appVol.volume.value;
    this.state3.masterVolume = this.appVol.volume.value;
    return () => this.loop.dispose();
  }

  render() {
    return (
      <React.Fragment>
        <h2>Select your preferred rhythm</h2>
        <div>{this.state1.steps[0]}</div>
        <div>{this.state2.steps[0]}</div>
        <div>{this.state3.steps[0]}</div>
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
          beat={this.state1}
          setBeat={this.setBeat}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.state2}
          setBeat={this.setBeat}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
        <PlayPause
          play={this.play}
          pause={this.pause}
          playState={this.playState}
          beat={this.state3}
          setBeat={this.setBeat}
          selection={true}
          style={{ marginBottom: "1rem" }}
        />
        <Regenerate
          updateBeats={this.updateBeats}
          currentBeat={this.currentBeatParams}
          chosenBeat={this.selectedBeat}
        />
		    <button onClick={this.updateBeatPatterns}>
            Regenerate Beats
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
