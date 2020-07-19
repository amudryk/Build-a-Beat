// GOAL:
//	- Set up population and other stuff, modelled after Borland's GA_xxx code
//	- Get initial parameters from questions and pass them to the DNA
//	- Return 3 possible tracks (or the idea could be to return 1, then if the user swipes left, run for another generation and present the fittest)
//	- Keep (target/current)? song properties in line with what is in the UI

//TODO: Decide on these values
var mutationRate = 1;		// Mutation rate
var totalPopulation = 100;	// Total population
var generations = 10;		// Number of generations between updates

var population = [];	// Array to hold the current population
// var matingPool = [];	// Array which we will use for our "mating pool"
// var fittest;

var num_beats = 16;	// number of beats in the song

// Pass initial values from Questions
// TODO: Attach these to inputs, maybe add more as needed
var beat_density1
var instruments1

// Target defined by the user parameters
// TODO: Figure out how to get the things from UI
var target = {
	beats:[][],
	tempo:get_from_UI,			// [10,200]
	beat_density:beat_density1,	// [0,100]
	instruments:instruments1,
	pitch:get_from_UI,			// [44,100]
	attack:get_from_UI,			// [0,1]
	delay:get_from_UI,			// [0,4]
}

// Empty 
var empty = {
	beats:[][],
	tempo:get_from_UI,	// [10,200]
	beat_density:[],	// [0,100]
	instruments:instruments1,
	pitch:0,			// [44,100]
	attack:0,			// [0,1]
	delay:0,			// [0,4]
	fitness:0
}

// Generate population of random DNA
for (var i = 0; i < totalPopulation; i++) {
	population[i] = DNA(num_beats, empty)
}

// Generate random DNA. Selected instruments are not random. Only works for drum beats. Not sure how we incorporate other instruments that have pitch.
function DNA(num_beats, genes) {
	for (var i = 0; i < genes.instruments.length; i++) {
		if (genes.instruments[i] == 1) {
			for (var j = 0; j < num_beats; j++) {
				genes.beats[i][j] = getRndInteger(0,1);	// Generate a random number between [0,1] to signify beat on/off
			}
		} else {
			for (var j = 0; j < num_beats; j++) {
				genes.beats[i][j] = 0;
			}
		}
	}
	genes.beat_density = calcBeatDensity(num_beats, genes)
	genes.tempo = getRndInteger(1,200);
	genes.pitch = getRndInteger(0,100);
	genes.attack = getRndInteger(0,10);
	genes.delay = getRndInteger(0,10);
	return genes;
}

// Re-usable way to calculate beat density
function calcBeatDensity(num_beats, genes) {
	var count;
	for (var i = 0; i < genes.instruments.length; i++) {
		count = 0;
		for (var j = 0; j < num_beats; j++) {
			if (genes.beats[i][j] == 1) {
				count++;
			}
		}
		genes.beat_density[i] = 100*(count/num_beats);
	}
	return genes.beat_density;
}

//random number generator function - from https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

// Fitness calculated by deviation from target values - low score is more fit
function calcFitnessInitial(genes, target) {
	fitness = 0;
	fitness = fitness + (1 - Math.abs(genes.tempo-target.tempo)/200)
	for (var i = 0; i < instruments.length; i++) {
		fitness = fitness + (1 - Math.abs(genes.beat_density[i]-target.beat_density[i])/100)
	}
	return fitness;
}

// Fitness function for a song in full
function calcFitnessFull(genes, target) {
	fitness = 0;
	fitness = fitness + (1 - Math.abs(genes.tempo-target.tempo)/200)
	for (var i = 0; i < instruments.length; i++) {
		fitness = fitness + (1 - Math.abs(genes.beat_density[i]-target.beat_density[i])/100)
	}
	fitness = fitness + (1 - Math.abs(genes.pitch-target.pitch)/100)
	fitness = fitness + (1 - Math.abs(genes.attack-target.attack)/1)
	fitness = fitness + (1 - Math.abs(genes.delay-target.delay)/4)
	return fitness
}

// TODO: Make updateGA happen on click, display the fittest
function updateGA(population) {
	var maxFit = 0;
	var matingPool = [];
	var fittest;
	for (var i = 0; i < population.length; i++) {
		population[i].fitness = calcFitnessInitial(population[i], target);
		if (population[i].fitness > maxFit) {
			maxFit = currentFitness;
			fittest = population[i];
		}
	}
	for (var i = 0; i < population.length; i++) {
		var nnnn = parseInt(population[i].fitness*100)	// Arbitrary multiplier
		for (var j = 0; j < nnnn; j++) {
			matingPool.push(population[i]);
		}
	}
	for (var i = 0; i < population.length; i++) {
		var a = getRndInteger(0,matingPool.length);
		var b = getRndInteger(0,matingPool.length);
		var partnerA = matingPool[a];
		var partnerB = matingPool[b];
		var child = crossover(partnerA, partnerB);
		child = mutate(mutationRate, child);
		population[i] = child;
	}
}

// Crossover
function crossover(pA, pB, empty, num_beats) {
	var child = empty;
	for (var i = 0; i < empty.instruments.length; i++) {
		if (getRndInteger(0,1) == 1) {
			child.beats[i] = pA.beats[i]
		} else {
			child.beats[i] = pB.beats[i]
		}
	}
	if (getRndInteger(0,1) == 1) {
		child.pitch = pA.pitch;
		child.attack = pA.attack;
		child.delay = pA.delay;
	} else {
		child.pitch = pB.pitch;
		child.attack = pB.attack;
		child.delay = pB.delay;
	}
	child.beat_density = calcBeatDensity(num_beats, child)
	return child;
}

// Mutate
function mutate(mutationRate, genes, num_beats) {
	for (var i = 0; i < genes.instruments; i++) {
		for (var j = 0; j < num_beats; j++) {
			if (getRndInteger(0,100) < mutationRate) {
				genes.beats[i][j] = getRndInteger(0,1)
			}
		}
	}
}
	