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

export let RowVectorMutationOptions = [
    "Value Mutation",
    "Swap Mutation",
    "Inversion Mutation",
    "Shuffle Mutation"
];

export let RowVectorCrossoverOptions = [
    "1-Point Crossover",
    "2-Point Crossover",
    "Uniform Crossover (p=0.5)"
]

let possibleValues = ["a", "b", "c", "d", "e", "f", "g", "h"]

export class RowVectorIndividual {


    constructor(mutationName, crossoverName) {
        this.values = this.generateRandomIndividual();
        this.fitness = this.getFitness();

        this.selectMutation(mutationName);
        this.selectCrossover(crossoverName);

        return this;
    }

    clone() {
        let newIndividual = new RowVectorIndividual(this.mutationName, this.crossoverName);
        for (let i = 0; i < 8; i++){
            newIndividual.values[i] = this.values[i];
        }
        newIndividual.fitness = this.fitness;

        return newIndividual;
    }

    selectMutation(mutationName){
        this.mutationName = mutationName;
        switch (mutationName){
            case "Value Mutation" :
                this.mutation = this.valueMutation;
                break;
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
            case "1-Point Crossover" :
                this.crossover = this.onepointCrossover;
                break;
            case "2-Point Crossover" :
                this.crossover = this.twoPointCrossover;
                break;
            case "Uniform Crossover (p=0.5)" :
                this.crossover = this.uniformCrossover;
                break;
        }
    }

    getFitness(){
        const [_, unsafe_positions, safe_positions] = position_to_binary_board(this.getPosition());
        return safe_positions.length;
    }

    getPosition(){
        let position = {}
        this.values.forEach((el, i) => position[""+el+(i+1)] = "bQ")
        return position;
    }

    generateRandomIndividual(){
        let values = []
        for (let i = 0; i < 8; i++){
            values[i] = possibleValues[Math.floor(Math.random() * 8)]
        }
        return values;
    }

    valueMutation(){
        let randomIndex = Math.floor(Math.random() * 8);
        this.values[randomIndex] = possibleValues[Math.floor(Math.random()*8)]
        this.fitness = this.getFitness();
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
        let randomIndex2 = 1+Math.floor(Math.random() * 7);
        while (randomIndex2 <= randomIndex){
            randomIndex2 = 1+Math.floor(Math.random() * 7);
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
        let randomIndex2 = 1+Math.floor(Math.random() * 7);
        while (randomIndex2 <= randomIndex){
            randomIndex2 = 1+Math.floor(Math.random() * 7);
        }
        let slice = this.values.slice(randomIndex, randomIndex2);
        shuffle(slice);

        for (let i = randomIndex; i<randomIndex2; i++) {
            this.values[i] = slice[i - randomIndex];
        }
        this.fitness = this.getFitness();
    }

    onepointCrossover(other){
        let child = this.clone();

        let cutoffPoint = 1+Math.floor(Math.random()*6);
        for (let i = 0; i < 8; i++){
            child.values[i] = i < cutoffPoint ? this.values[i] : other.values[i];
        }
        child.fitness = child.getFitness();
        return child;
    }

    twoPointCrossover(other){
        let child = this.clone();
        let cutoffPoint = 1+Math.floor(Math.random()*5);
        let cutoffPoint2 = cutoffPoint+1+Math.floor(Math.random()*(6-cutoffPoint));
        for (let i = 0; i < 8; i++){
            child.values[i] = i < cutoffPoint || i > cutoffPoint2 ? this.values[i] : other.values[i];
        }
        child.fitness = child.getFitness();
        return child;
    }

    uniformCrossover(other){
        let child = this.clone();
        for (let i = 0; i < 8; i++){
            child.values[i] = Math.random() < 0.5 ? this.values[i] : other.values[i];
        }
        child.fitness = child.getFitness();
        return child;
    }


}

export function validateRowVectorIndividual() {
    console.log("test generation")
    let a = new RowVectorIndividual();


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

    console.log("test value")
    for (let i = 0; i < 100; i++){
        a.valueMutation()
        console.log(a.values)
    }

    console.log("test swap")
    for (let i = 0; i < 100; i++){
        a.swapMutation()
        console.log(a.values)
    }

    let b = new RowVectorIndividual();
    a.values = ["a","a","a","a","a","a","a","a"]
    b.values = ["b","b","b","b","b","b","b","b"]

    console.log("test 1pointCrossover")
    for (let i = 0; i < 20; i++){
        console.log(a.onepointCrossover(b).values)
    }

    console.log("test twoPointCrossover")
    for (let i = 0; i < 20; i++){
        console.log(a.twoPointCrossover(b).values)
    }

    console.log("test uniformCrossover")
    for (let i = 0; i < 20; i++){
        console.log(a.uniformCrossover(b).values)
    }

    console.log("test getPosition and getFitness")
    for (let i = 0; i < 10; i++){
        let a = new RowVectorIndividual();
        console.log(a.values);
        console.log(a.getPosition());
        console.log(a.getFitness());
    }

}