import {position_to_binary_board} from "./chessboard_utils.js";

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export let PermutationVectorMutationOptions = [
    "Swap Mutation",
    "Inversion Mutation",
    "Shuffle Mutation"
];

export let PermutationVectorCrossoverOptions = [
    "Cycle Crossover"
]

let colNames = ["a", "b", "c", "d", "e", "f", "g", "h"]
let possibleValues = [1, 2, 3, 4, 5, 6, 7, 8]

export class PermutationIndividual {

    constructor(mutationName, crossoverName) {
        this.values = this.generateRandomIndividual();
        this.fitness = this.getFitness();

        this.selectMutation(mutationName);
        this.selectCrossover(crossoverName);

        return this;
    }

    clone() {
        let newIndividual = new PermutationIndividual(this.mutationName, this.crossoverName);
        for (let i = 0; i < 8; i++){
            newIndividual.values[i] = this.values[i];
        }
        newIndividual.fitness = this.fitness;

        return newIndividual;
    }

    selectMutation(mutationName){
        this.mutationName = mutationName;
        switch (mutationName){
            case "Swap Mutation" :
                this.mutation = this.swapMutation;
                break;
            case "Inversion Mutation" :
                this.mutation = this.inversionMutation;
                break;
            case "Shuffle Mutation" :
                this.mutation = this.shuffleMutation;
                break;
        }
    }

    selectCrossover(crossoverName){
        this.crossoverName = crossoverName;
        switch (crossoverName){
            case "Cycle Crossover" :
                this.crossover = this.cycleCrossover;
                break;
        }
    }

    getFitness(){
        const [_, unsafe_positions, safe_positions] = position_to_binary_board(this.getPosition());
        return safe_positions.length;
    }

    getPosition(){
        let position = {}
        this.values.forEach((el, i) => position[""+colNames[i]+el] = "bQ")
        return position;
    }

    generateRandomIndividual(){
        let values = [1,2,3,4,5,6,7,8]
        shuffle(values);
        return values;
    }

    swapMutation(){
        let randomIndex = Math.floor(Math.random() * 8);
        let randomIndex2 = Math.floor(Math.random() * 8);
        while (randomIndex2 === randomIndex){
            randomIndex2 = Math.floor(Math.random() * 8);
        }
        let a = this.values[randomIndex2];
        this.values[randomIndex2] = this.values[randomIndex];
        this.values[randomIndex] = a;
        this.fitness = this.getFitness();
    }

    inversionMutation(){
        let randomIndex = Math.floor(Math.random() * 7);
        let randomIndex2 = 1+Math.floor(Math.random() * 8);
        while (randomIndex2 <= randomIndex){
            randomIndex2 = 1+Math.floor(Math.random() * 8);
        }
        let slice = this.values.slice(randomIndex, randomIndex2);
        slice.reverse();

        for (let i = randomIndex; i<randomIndex2; i++) {
            this.values[i] = slice[i - randomIndex];
        }
        this.fitness = this.getFitness();
    }

    shuffleMutation(){
        let randomIndex = Math.floor(Math.random() * 7);
        let randomIndex2 = 1+Math.floor(Math.random() * 8);
        while (randomIndex2 <= randomIndex){
            randomIndex2 = 1+Math.floor(Math.random() * 8);
        }
        let slice = this.values.slice(randomIndex, randomIndex2);
        shuffle(slice);

        for (let i = randomIndex; i<randomIndex2; i++) {
            this.values[i] = slice[i - randomIndex];
        }
        this.fitness = this.getFitness();
    }

    cycle_detection(parent1, parent2){
        let cycles = [0,0,0,0,0,0,0,0]

        let cycleNumber = 1;
        for (let i = 0; i < 8; i++){
            if (cycles[i] === 0){
                let cycle_indices = this.get_cycle_indices(i, parent1, parent2);
                for (let index in cycle_indices)
                {
                    cycles[cycle_indices[index]] = cycleNumber;
                }
                cycleNumber++;
            }
        }

        return cycles;
    }

    get_cycle_indices(start_index, parent1, parent2){
        let cycle_indices = [start_index];
        let current_value = null;
        let current_index = start_index;
        while (true){
            current_value = parent1[current_index];
            current_index = parent2.indexOf(current_value);

            if (current_index === start_index) {
                return cycle_indices;
            }

            cycle_indices = cycle_indices.concat([current_index]);
        }
    }

    cycleCrossover(other){
        let child = this.clone();
        let cycles = this.cycle_detection(this.values, other.values)

        for (let i = 0; i < 8; i++){
            if ((cycles[i] % 2) === 1) {
                child.values[i] = this.values[i];
            } else {
                child.values[i] = other.values[i];
            }
        }

        child.fitness = child.getFitness();
        return child;
    }
}

export function validatePermutationIndividual() {
    console.log("test generation")
    let a = new PermutationIndividual();

    console.log("test inversion")
    for (let i = 0; i < 100; i++){
        a.inversionMutation()
        console.log(a.values)
    }

    console.log("test shuffle")
    for (let i = 0; i < 100; i++){
        a.shuffleMutation()
        console.log(a.values)
    }

    console.log("test swap")
    for (let i = 0; i < 100; i++){
        a.swapMutation()
        console.log(a.values)
    }

    let b = new PermutationIndividual();
    a.values = [1,6,2,4,8,7,5,3]
    b.values = [8,7,4,1,2,6,5,3]

    console.log("test cycleCrossover")
    console.log("a", a.values)
    console.log("b", b.values)
    console.log(a.cycleCrossover(b).values)

    console.log("test getPosition and getFitness")
    for (let i = 0; i < 10; i++){
        let a = new PermutationIndividual();
        console.log(a.values);
        console.log(a.getPosition());
        console.log(a.getFitness());
    }

}