// Generate population of random DNA
// Currently cannot disable instruments. To do that try using DNA function
export function generatePopulation(totalPopulation, numBeats, instruments, beats) {
	var population = new Array(totalPopulation);
	var fitness = 0;
	for (var i = 0; i < totalPopulation; i++) {
		population[i] = Array.from(
			{length: instruments.length},
			() => Array.from({length: numBeats}, () => getRndInteger(0,1.9)));
		population[i].push(fitness);
	}
	return population;
}

// Generate random DNA. Selected instruments are not random. Only works for drum beats. Not sure how we incorporate other instruments that have pitch.
export function DNA(numBeats, instruments, beats) {
	for (var i = 0; i < instruments.length; i++) {
		if (instruments[i] === 1) {
			beats[i] = Array.from({length: numBeats}, () => getRndInteger(0,1.9));	// Generate an array of random 0's and 1's
		} else {
			beats[i] = Array.from({length: numBeats}, () => 0);
		}
	}
	return beats;
}

//random number generator function - from https://www.w3schools.com/js/js_random.asp
export function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}

// Re-usable way to calculate beat density
function calcBeatDensity(numBeats, beats) {
	var count = 0;
	var beatDensity = [];
	for (var i in beats) {
		for (var j in beats[i]) {
			if (beats[i][j] === 1) {
				count++;		
			}
		}
		beatDensity[i] = 100*(count/numBeats);
	}
	return beatDensity;
}

// Fitness calculated by deviation from target values - low score is more fit
function calcFitnessInitial(currBeatPattern, targetBeatDensity, numBeats) {
	var fitness = 0;
	var beatDensity = calcBeatDensity(numBeats, currBeatPattern)
	for (var i in currBeatPattern) {
		fitness = fitness + (1 - Math.abs(beatDensity[i]-targetBeatDensity[i])/100)
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
export function updateGA(population, targetBeatDensity, mutationRate, numBeats, instruments) {
	var maxFit = 0;
	var secondMaxFit = 0;
	var thirdMaxFit = 0;
	var matingPool = [];
	var fittest;
	var secondFit;
	var thirdFit;
	for (var i in population) {
		population[i][1] = calcFitnessInitial(population[i][0], targetBeatDensity, numBeats);
		if (population[i][1] > maxFit) {
			maxFit = population[i][1];
			fittest = population[i][0];
		} else if (population[i][1] > secondMaxFit) {
			secondMaxFit = population[i][1];
			secondFit = population[i][0];
		} else if (population[i][1] > thirdMaxFit) {
			thirdMaxFit = population[i][1];
			thirdFit = population[i][0];
		}
	}
	for (var j in population) {
		var nnnn = parseInt(population[j][1]*100)	// Arbitrary multiplier
		for (var k = 0; k < nnnn; k++) {
			matingPool.push(population[j][0]);
		}
	}
	for (var m in population) {
		var a = getRndInteger(0,matingPool.length);
		var b = getRndInteger(0,matingPool.length);
		var partnerA = matingPool[a];
		var partnerB = matingPool[b];
		var child = crossover(partnerA, partnerB);
		child = mutate(mutationRate, child);
		population[m] = child;
	}
	return [fittest, secondFit, thirdFit, population];
}

// Crossover
function crossover(pA, pB) {
	var child = [];
	for (var i in pA) {
		if (getRndInteger(0,1.9) === 1) {
			child[i] = pA[i];
		} else {
			child[i] = pB[i];
		}
	}
	return child;
}

// Mutate
function mutate(mutationRate, beats) {
	for (var i in beats) {
		for (var j in beats[i]) {
			if (getRndInteger(0,100) < mutationRate) {
				beats[i][j] = getRndInteger(0,1.9)
			}
		}
	}
	return beats;
}
