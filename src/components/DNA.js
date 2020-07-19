// General Algorithm:

// Process:
// 1. Calculate the DNA's "fitness"
// 2. Mate DNA with another set of DNA
// 3. Mutate DNA

// 5 Attributes to Consider:
// 1. Tempo
// 2. Beat Density

// 3. Pitch
// 4. Echo
// 5. Sharpness

class DNA {
	
	// The genetic sequence (defines a "song" in code)
	var genes = {
		beats:[][],
		tempo:0,
		beat_density:[],
		pitch:0,
		attack:0,
		delay:0
	}
	
	var target = {
		beats:[][],
		tempo:0,
		beat_density:[],
		pitch:0,
		attack:0,
		delay:0
	}
	
	var fitness;
	var num_beats = 16;
	var instruments = [1,1,1,0]	// [Kick,Snare,hi-hat,piano]
	var count;
	
	// Constructor (makes a random DNA)
	DNA(num_beats, instruments) {
		for (var i = 0; i < instruments.length; i++) {
			if instruments[i] == 1:
				count = 0
				for (var j = 0; j < num_beats; j++) {
					genes.beats[i][j] = getRndInteger(0,1);	// Generate a random number between [0,1]
					if genes.beats[i][j] == 1:
						count++;
				}
				genes.beat_density[i] = count/num_beats;
			else:
				for (var j = 0; j < num_beats; j++) {
					genes.beats[i][j] = 0;
				}
				genes.beat_density[i] = 0;
		}
		genes.tempo = getRndInteger(1,200);
		genes.pitch = getRndInteger(0,100);
		genes.attack = getRndInteger(0,10);
		genes.delay = getRndInteger(0,10);
	}
	
	// random number generator function - from https://www.w3schools.com/js/js_random.asp
	function getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	}
	
	// Fitness function for the initial creation
	calcFitnessInitial(target) {
		var score = 0;
		score = score + Math.abs(genes.tempo-target.tempo)
		for (var i = 0; i < instruments.length; i++) {
			score = score + Math.abs(genes.beat_density[i] - target.beat_density[i])
		}
	}
	
	// Fitness function for a song in full
	calcFitnessFull(target) {
		var score = 0;
		score = score + Math.abs(genes.tempo-target.tempo)
		for (var i = 0; i < instruments.length; i++) {
			score = score + Math.abs(genes.beat_density[i] - target.beat_density[i])
		}
		score = score + Math.abs(genes.pitch-target.pitch)
		score = score + Math.abs(genes.attack-target.attack)
		score = score + Math.abs(genes.delay-target.delay)
	}
	
	
	