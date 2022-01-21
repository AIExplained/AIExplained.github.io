import {highlightCollisions, example_positions, position_to_binary_board} from "./chessboard_utils.js";
import {RowVectorIndividual, validateRowVectorIndividual} from "./rowVectorIndiduals.js"
import {ColumnVectorIndividual, validateColumnVectorIndividual} from "./columnVectorIndividuals.js"
import {ConstrainedMatrixIndividual, validateConstrainedMatrixIndividual} from "./constrainedMatrixIndividuals.js"

let board = Chessboard('board-ea-test', {
    draggable: false,
    position: example_positions[0],
});

let $board = $('#board-ea-test');

position_to_binary_board(board.position());

//runEvolutionaryAlgorithm(board);

document.getElementById("awesome").addEventListener("click", doStuff);

function doStuff(){
    //validateConstrainedMatrixIndividual()

    let representationName = $('#select_representation').find(":selected").text();
    let mutationName = $('#select_mutation').find(":selected").text();
    let crossoverName = $('#select_crossover').find(":selected").text();

    let repetitions = 10;
    let solvedRuns = 0;
    let totalGenerations = 0;
    for (let i = 0; i < repetitions; i++){
        let result = runEvolutionaryAlgorithm(representationName, mutationName, crossoverName);
        if (result[0]) solvedRuns += 1;
        totalGenerations += result[1];
    }
    console.log(representationName, mutationName, crossoverName, solvedRuns, totalGenerations/repetitions);

}

function updateGUI(){
    var $selectRepresentation = $("#select_representation");
    var $selectMutationion = $("#select_mutation");
    var $selectCrossover = $("#select_crossover");

    var options = [
        {text: "one", value: 1},
        {text: "two", value: 2}
    ];

    $("#foo").replaceOptions(options);
}


function runEvolutionaryAlgorithm(representationName, mutationName, crossoverName){
    /*console.log(representationName);
    console.log(mutationName);
    console.log(crossoverName);*/

    // parameters
    let populationsize = 10;
    let maxGenerations = 1000;
    let generations = [];

    // initialization
    let currentPopulation = initializePopulation(populationsize, representationName, mutationName, crossoverName);
    generations[0] = currentPopulation;

    //
    function checkSolved(population) {
        let solved = false;
        population.forEach(individual => {
            if (individual.fitness === 8){
                solved = true;
            }
        })
        return solved;
    }

    while (checkSolved(currentPopulation) === false && generations.length !== maxGenerations) {
        //console.log(currentPopulation.map(el => el.getFitness()))
        let mutationChilds = []

        let selectedIndividuals = tournamentSelection(currentPopulation, populationsize);
        selectedIndividuals.forEach(el => {
            let newEl = el.clone()
            newEl.mutation();
            mutationChilds[mutationChilds.length] = newEl;
        })

        let crossOverChilds = []
        for (let i = 0; i < 10; i++){
            let parent1 = selectedIndividuals[Math.floor(Math.random()*10)];
            let parent2 = selectedIndividuals[Math.floor(Math.random()*10)];

            crossOverChilds[crossOverChilds.length] = parent1.crossover(parent2);
        }

        let children = mutationChilds.concat(crossOverChilds);
        children.sort((a,b) => (a.fitness > b.fitness) ? -1 : ((b.fitness > a.fitness) ? 1 : 0))
        //console.log("children: " + children.map(el => el.getFitness()))

        currentPopulation = children.slice(0, populationsize);
        generations[generations.length] = currentPopulation;
    }
    //console.log("currentPopulation: " + currentPopulation.map(el => el.fitness))
    //console.log("the puzzle has been solved: " + checkSolved(currentPopulation) +" after " + generations.length +" generations");
    return [checkSolved(currentPopulation), generations.length]
}


function tournamentSelection(population, populationsize) {
    let tournamentsize = 4;
    let selectedIndividuals = [];

    function getRandomSubarray(arr, size) {
        var shuffled = arr.slice(0), i = arr.length, temp, index;
        while (i--) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(0, size);
    }

    for (let i = 0; i < populationsize; i++){
        let tournament = getRandomSubarray(population, tournamentsize);
        tournament.sort((a,b) => (a.fitness > b.fitness) ? -1 : ((b.fitness > a.fitness) ? 1 : 0))
        selectedIndividuals[i] = tournament[0].clone();
    }
    return selectedIndividuals;
}

function initializePopulation(populationsize, representationName, mutationName, crossoverName){
    let population = []
    for (let i = 0; i < populationsize; i++){
        switch (representationName){
            default:
                population[i] = new ConstrainedMatrixIndividual(mutationName, crossoverName);
                break;
        }
    }
    return population
}


// INDIVIDUALS


//---------------------------------------------

class PermutationVectorIndividual {

}

