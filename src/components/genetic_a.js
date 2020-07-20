// Generate population of random DNA
export function generatePopulation(totalPopulation, numBeats, instruments, beats) {
	var population = [[[]]];
	var fitness = 0;
	for (var i = 0; i < totalPopulation; i++) {
		for (var j = 0; j < instruments.length; j++) {
			if (instruments[j] === 1) {
				beats[j] = Array.from({length: numBeats}, () => getRndInteger(0,1.9))	// Generate an array of random 0's and 1's
			} else {
				beats[j] = Array.from({length: numBeats}, 0)
			}
		}
		population[i] = [beats,fitness]

	}
	return population;
}

// Generate random DNA. Selected instruments are not random. Only works for drum beats. Not sure how we incorporate other instruments that have pitch.
export function DNA(numBeats, instruments, beats) {
	for (var i = 0; i < instruments.length; i++) {
		if (instruments[i] === 1) {
			beats[i] = Array.from({length: numBeats}, () => getRndInteger(0,1.9))	// Generate an array of random 0's and 1's
		} else {
			beats[i] = Array.from({length: numBeats}, 0)
		}
	}
	var fitness = 0;
	return [beats,fitness];
}

// Re-usable way to calculate beat density
function calcBeatDensity(numBeats, genes) {
	var count;
	for (var i = 0; i < genes.instruments.length; i++) {
		count = 0;
		for (var j = 0; j < numBeats; j++) {
			if (genes.beats[i][j] === 1) {
				count++;
			}
		}
		genes.beat_density[i] = 100*(count/numBeats);
	}
	return genes.beat_density;
}

//random number generator function - from https://www.w3schools.com/js/js_random.asp
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

// Fitness calculated by deviation from target values - low score is more fit
function calcFitnessInitial(genes, target_b_d) {
	var fitness = 0;
	// for (var i = 0; i < genes.instruments.length; i++) {
	for (var i = 0; i < 3; i++) {
		fitness = fitness + (1 - Math.abs(genes.beat_density[i]-target_b_d[i])/100)
	}
	return fitness;
}

// Fitness function for a song in full
function calcFitnessFull(genes, target) {
	var fitness = 0;
	fitness = fitness + (1 - Math.abs(genes.tempo-target.tempo)/200)
	for (var i = 0; i < genes.instruments.length; i++) {
		fitness = fitness + (1 - Math.abs(genes.beat_density[i]-target.beat_density[i])/100)
	}
	fitness = fitness + (1 - Math.abs(genes.pitch-target.pitch)/100)
	fitness = fitness + (1 - Math.abs(genes.attack-target.attack)/1)
	fitness = fitness + (1 - Math.abs(genes.delay-target.delay)/4)
	return fitness
}

// TODO: Make updateGA happen on click, display the fittest
export function updateGA(population, targetBeatDensity, mutationRate, empty, numBeats) {
	var maxFit = 0;
	var matingPool = [];
	var fittest;
	for (var i = 0; i < population.length; i++) {
		population[i].fitness = calcFitnessInitial(population[i], targetBeatDensity);
		if (population[i].fitness > maxFit) {
			maxFit = population[i].fitness;
			fittest = population[i];
		}
	}
	for (var j = 0; j < population.length; j++) {
		var nnnn = parseInt(population[j].fitness*100)	// Arbitrary multiplier
		for (var k = 0; k < nnnn; k++) {
			matingPool.push(population[j]);
		}
	}
	for (var m = 0; m < population.length; m++) {
		var a = getRndInteger(0,matingPool.length);
		var b = getRndInteger(0,matingPool.length);
		var partnerA = matingPool[a];
		var partnerB = matingPool[b];
		var child = crossover(partnerA, partnerB, empty, numBeats);
		child = mutate(mutationRate, child);
		population[m] = child;
	}
	return [fittest,population];
}

// Crossover
function crossover(pA, pB, empty, numBeats) {
	var child = empty;
	for (var i = 0; i < empty.instruments.length; i++) {
		if (getRndInteger(0,1) === 1) {
			child.beats[i] = pA.beats[i]
		} else {
			child.beats[i] = pB.beats[i]
		}
	}
	if (getRndInteger(0,1) === 1) {
		child.pitch = pA.pitch;
		child.attack = pA.attack;
		child.delay = pA.delay;
	} else {
		child.pitch = pB.pitch;
		child.attack = pB.attack;
		child.delay = pB.delay;
	}
	child.beat_density = calcBeatDensity(numBeats, child)
	return child;
}

// Mutate
function mutate(mutationRate, genes, numBeats) {
	for (var i = 0; i < genes.instruments; i++) {
		for (var j = 0; j < numBeats; j++) {
			if (getRndInteger(0,100) < mutationRate) {
				genes.beats[i][j] = getRndInteger(0,1)
			}
		}
	}
}
