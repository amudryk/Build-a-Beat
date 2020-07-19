
import React, { Component } from "react";

// TODO: Decide on these values
// mutationRate = 1;		// Mutation rate
// totalPopulation = 100;	// Total population
// generations = 10;		// Number of generations between updates

// population = [];	// Array to hold the current population	

// numBeats = 16;	// number of beats in the song

// Pass initial values from Questions
// TODO: Attach these to inputs, maybe add more as needed
// instruments1 = [1,1,1]
// beat_density1 = Array(instruments1.length).fill(25)
// beats1 = Array(instruments1.length).fill(Array(numBeats));

// get_from_UI = 0;	// Placeholder

// // Target defined by the user parameters
// // TODO: Figure out how to get the things from UI
// target = {
// 	beats:beats1,
// 	tempo:get_from_UI,			// [10,200]
// 	beat_density:beat_density1,	// [0,100]
// 	instruments:instruments1,
// 	pitch:get_from_UI,			// [44,100]
// 	attack:get_from_UI,			// [0,1]
// 	delay:get_from_UI,			// [0,4]
// }

// // Empty 
// empty = {
// 	beats:beats1,
// 	tempo:get_from_UI,	// [10,200]
// 	beat_density:[],	// [0,100]
// 	instruments:instruments1,
// 	pitch:0,			// [44,100]
// 	attack:0,			// [0,1]
// 	delay:0,			// [0,4]
// 	fitness:0
// }

// Generate population of random DNA
export function generatePopulation (totalPopulation, numBeats, empty) {
	var population = [];
	for (var i = 0; i < totalPopulation; i++) {
		population[i] = DNA(numBeats, empty)
	}
}

// Generate random DNA. Selected instruments are not random. Only works for drum beats. Not sure how we incorporate other instruments that have pitch.
export function DNA(numBeats, genes) {
	for (var i = 0; i < genes.instruments.length; i++) {
		if (genes.instruments[i] == 1) {
			genes.beats[i] = Array.from({length: numBeats}, () => getRndInteger(0,1.9))	// Generate an array of random 0's and 1's
		} else {
			for (var k = 0; k < numBeats; k++) {
				genes.beats[i][k] = 0;
			}
		}
	}
	genes.beat_density = calcBeatDensity(numBeats, genes)
	genes.tempo = getRndInteger(1,200);
	genes.pitch = getRndInteger(0,100);
	genes.attack = getRndInteger(0,10);
	genes.delay = getRndInteger(0,10);
	return genes;
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
function calcFitnessInitial(genes, target) {
	var fitness = 0;
	fitness = fitness + (1 - Math.abs(genes.tempo-target.tempo)/200)
	for (var i = 0; i < genes.instruments.length; i++) {
		fitness = fitness + (1 - Math.abs(genes.beat_density[i]-target.beat_density[i])/100)
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
function updateGA(population, target, mutationRate) {
	var maxFit = 0;
	var matingPool = [];
	var fittest;
	for (var i = 0; i < population.length; i++) {
		population[i].fitness = calcFitnessInitial(population[i], target);
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
		var child = crossover(partnerA, partnerB);
		child = mutate(mutationRate, child);
		population[m] = child;
	}
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
