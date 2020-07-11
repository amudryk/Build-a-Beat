import React, { Component } from "react";
import * as Tone from "tone";

import './App.css';

import kick from './images/kick.png'
import snare from './images/snare.png'
import hihat from './images/hihat.png'

import Title from "./components/Title.js";
import Cell from "./components/Cell.js";
import PlayPause from "./components/PlayPause.js";
import ClearPattern from "./components/ClearPattern.js";
import RandomPattern from "./components/RandomPattern.js";
import BpmSlider from "./components/BpmSlider.js";
import VolumeSlider from "./components/VolumeSlider.js";
import SwingSlider from "./components/SwingSlider.js";
import RecordStart from "./components/RecordStart.js"
import KickTuningKnob from "./components/KickTuningKnob.js";
import SnareDelayKnob from "./components/SnareDelayKnob.js";
import CymbalReleaseKnob from "./components/CymbalReleaseKnob.js";


class App extends Component {

  state = {
    steps: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    bpm: 120,
    notes: ["A", "C#", "E", "F#"],
    column: 0,
    activeColumn: 0,
    time: 0,
    masterVolume: 0,
    kickDrumTuning: 43.65,
    closedHihatDecayLevel: 0,
    mediaRecorderState: false
  };
  
  /// INIT SYNTHS & FX ///

  // create master volume for App
  appVol = new Tone.Volume();

  // create pingpong delay for snare
  pingPong = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.32,
    wet: 0            // wet level can be modified by user via the snaredelayknob
  })

  // create compressor for kick
  kickComp = new Tone.Compressor(-30, 2);

  // kick
  kick = new Tone.MembraneSynth({
    volume: 0,
    pitchDecay : 0.032,
    octaves : 6,
    oscillator : {
      type : "square4"
    },
    envelope : {
      attack : 0.01,
      decay: 0.2,
      sustain : 0.01,
      release: 0.75,
    }
  }).chain(this.kickComp, this.appVol, Tone.Master);

  // snare
  snare = new Tone.NoiseSynth({
    volume: -8.3,
    noise: {
      type: "pink"
    },
    envelope: {
      attack: 0.002,
      decay: 0.21,
      sustain: 0.05
    }
  }).chain(this.pingPong, this.appVol, Tone.Master);

  // hihat
  closedHihat = new Tone.MetalSynth({
    volume: -58,
    frequency: 150,
    envelope: {
      attack: 0.002,
      decay: 0.25,
      release: 0.025
    },
    harmonicity: 4.1,
    modulationIndex: 40,
    resonance: 2000,
    octaves: 1
  }).chain(this.appVol, Tone.Master);

  // RECORDING VARIABLES //

  audioContext = Tone.context;

  dest = this.audioContext.createMediaStreamDestination();

  recorder = new MediaRecorder(this.dest.stream);

  output = Tone.Master;

  chunks = [];

  // CHANGE FUNCTIONS //

  changeKickDrumTuning = (value) => {
    this.setState({
      kickDrumTuning: value
    })
  }

  // delay for snare
  changePingPongDelayLevel = (value) => {
    this.pingPong.wet.value = value;
  }

  changeVolume = value => {
    this.appVol.volume.value = value;

    this.setState({
      masterVolume: value
    });
  };

  changeSwing = value => {
    Tone.Transport.swing = value;
  };

  changeBpm = value => {
    Tone.Transport.bpm.value = value;

    this.setState({
      bpm: value
    });
  };

  play = () => {
    Tone.Transport.bpm.value = this.state.bpm;
    Tone.Transport.toggle()
  };

  pause = () => {
    Tone.Transport.stop();
    console.log("paused");
  };

  stepToggle = (x, y) => {
    if (this.state.steps[x][y] === 0) {
      const newSteps = this.state.steps;
      newSteps[x][y] = 1;
      this.setState({ steps: newSteps });
    } else {
      const newSteps = this.state.steps;
      newSteps[x][y] = 0;
      this.setState({ steps: newSteps });
    }
    console.log(`You Clicked ${x} and ${y}`);
  };


  // ON INIT //

  componentDidMount() {
    this.loop = new Tone.Sequence(
      (time, col) => {
        this.setState({
          column: col
        });

        this.state.steps.map((row, noteIndex) => {
          if (row === this.state.steps[0] && row[col]) {
            // randomised velocities (volume of each triggered note)
            let vel = Math.random() * 0.5 + 0.5;
            // Trigger the sound to be played here

            return this.kick.triggerAttackRelease(
              this.state.kickDrumTuning,
              "16n",
              time,
              vel
            );
          } else if (row === this.state.steps[2] && row[col]) {
            let vel = Math.random() * 0.45 + 0.45;
            this.snare.triggerAttackRelease("16n", time, vel);
          } else if (row === this.state.steps[1] && row[col]) {
            // let vel = Math.random() * 0.5 + 0.5;
            this.closedHihat.triggerAttackRelease("16n", time, -12);
          } 
        });
        this.setState({
          activeColumn: col
        });

        this.setState({
          time: time
        });

        // Tone.Draw.schedule(() => {
        //   this.backgroundDisco()
        // }, "16n", time);


      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],   // or this.state.steps[0].map((_, i) => i) -
      "16n"
    ).start(0);

    this.setState({
      masterVolume: this.appVol.volume.value
    });
    return () => this.loop.dispose();
  }

  // PATTERN-RELATED FUNCTIONS //

  randomPattern = () => {
    let makeARandomNumber = () => {
      return Math.random() > 0.8 ? 1 : 0;  // if number returned is greater 0.8 than make it 1 otherwise its 0
    }

    let randoms = Array(16).fill(0).map(makeARandomNumber);
    let randoms1 = Array(16).fill(0).map(makeARandomNumber);
    let randoms2 = Array(16).fill(0).map(makeARandomNumber);

    let randomSteps = [randoms, randoms1, randoms2]

    this.setState({
      steps: randomSteps
    })
  }

  clearPattern = () => {
    this.setState({
      steps: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
    });
  };
  

  record = () => {
    // if (this.state.mediaRecorderState === false) {
    //   this.output.connect(this.dest);
    //   this.recorder.start()

    //   this.recorder.ondataavailable = evt => this.chunks.push(evt.data);

    //   this.setState({
    //     mediaRecorderState: true
    //   })
    // } else {
    //   this.recorder.stop()

    //   this.recorder.onstop = evt => {
    //     let blob = new Blob(this.chunks, { type: 'audio/wav; codecs=opus' });
    // // this.audio.src = URL.createObjectURL(blob);
    //     download(blob, "rhythmcomposer.wav", 'audio/wav')
    //   };

    //   this.setState({
    //     mediaRecorderState: false
    //   })

    //   this.chunks = [];
    // }
    console.log("NOT IMPLEMENTED")

  }


  render() {
    let cells = this.state.steps.map((row, xCoord) => {
      return (
        <div className="row">
          {row.map((cell, yCoord) => (
            <Cell
              stepToggle={this.stepToggle}
              x={xCoord}
              y={yCoord}
              activeColumn={this.state.activeColumn}
              steps={this.state.steps}
            />
          ))}
        </div>
      );
    });


    return (
      <div className="App">
        <div className="ui grid">

          <div className="row">
            <div className="sixteen wide column" style={{"text-align": "center"}}>
              <Title />
            </div>
          </div>

          <div className="row">
            <div id="intrumentImages" class="one wide column">
              <img className="kick" src={kick} alt="kick"/>
              <img className="hihat" src={hihat} alt="hihat" />
              <img className="snare" src={snare} alt="snare" />
            </div>

            <div id="musicGrid" className="fourteen wide column">
              {cells}
            </div>

            <div id="knobImages" className="one wide column">
              <KickTuningKnob changeKickDrumTuning={this.changeKickDrumTuning} />
              <CymbalReleaseKnob changeCymbalReleaseLevel={this.changeCymbalReleaseLevel} />
              <SnareDelayKnob changePingPongDelayLevel={this.changePingPongDelayLevel} />
            </div>
          </div>

          <div className="row" style={{marginHorizontal: 50}}>
            <div className="one wide column"></div>
            <div className="three wide column">
              <PlayPause play={this.play} pause={this.pause} playState={this.playState} style={{marginBottom: "1rem"}} />
              <RecordStart className="record-button" record={this.record}/>
            </div>
            <div className="three wide column">
              <ClearPattern clearPattern={this.clearPattern} />
            </div>
            <div className="three wide column">
              <RandomPattern randomPattern={this.randomPattern} />
            </div>
            <div className="two wide column center">
              <BpmSlider changeBpm={this.changeBpm} />
            </div>
            <div className="two wide column center">
              <SwingSlider changeSwing={this.changeSwing} />
            </div>
            <div className="two wide column center">
              <VolumeSlider changeVolume={this.changeVolume} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
