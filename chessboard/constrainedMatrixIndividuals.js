import {binary_board_to_position, getSafeAndUnsafePosition} from "./chessboard_utils.js";

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

export let ConstrainedMatrixMutationOptions = [
    "Swap Mutation",
    "Shuffle Mutation"
];

export let ConstrainedMatrixCrossoverOptions = [
    "1-Point Crossover",
    "2-Point Crossover"
]


export class ConstrainedMatrixIndividual {

    constructor(mutationName, crossoverName) {
        this.values = this.generateRandomIndividual();
        this.fitness = this.getFitness();

        this.selectMutation(mutationName);
        this.selectCrossover(crossoverName);

        return this;
    }

    clone() {
        let newIndividual = new ConstrainedMatrixIndividual(this.mutationName, this.crossoverName);
        for (let x = 0; x < 8; x++){
            for (let y = 0; y < 8; y++) {
                newIndividual.values[x][y] = this.values[x][y];
            }
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
        }
    }

    getFitness(){
        const [_, safe_positions] = getSafeAndUnsafePosition(this.values);
        return safe_positions.length;
    }

    getPosition(){
        return binary_board_to_position(this.values);
    }

    generateRandomIndividual(){
        let values = []
        for (let i = 0; i < 8; i++){
            values[i] = [0,0,0,0,0,0,0,0]
        }
        let success = 0;
        while (success < 8){
            let x = Math.floor(Math.random()*8);
            let y = Math.floor(Math.random()*8);

            if (values[x][y] === 0){
                success += 1;
                values[x][y] = 1;
            }
        }
        return values;
    }

    swapMutation(){
        let x = [];
        let y = [];
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.values[i][j] === 1){
                    x[x.length] = i;
                    y[y.length] = j;
                }
            }
        }

        let randomIndex = Math.floor(Math.random() * 8);
        let randomIndex2 = Math.floor(Math.random() * 8);
        while (randomIndex2 === randomIndex){
            randomIndex2 = Math.floor(Math.random() * 8);
        }

        let a = this.values[x[randomIndex2]][y[randomIndex2]];
        this.values[x[randomIndex2]][y[randomIndex2]] = this.values[x[randomIndex]][y[randomIndex]];
        this.values[x[randomIndex]][y[randomIndex]] = a;

        this.fitness = this.getFitness();
    }

    shuffleMutation(){
        this.values = this.generateRandomIndividual();

        this.fitness = this.getFitness();
    }

    onepointCrossover(other){
        let child = this.clone();
        let x1 = [];
        let y1 = [];
        let x2 = [];
        let y2 = [];
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.values[i][j] === 1){
                    x1[x1.length] = i;
                    y1[y1.length] = j;
                }
                if (other.values[i][j] === 1){
                    x2[x2.length] = i;
                    y2[y2.length] = j;
                }
                child.values[i][j] = 0;
            }
        }

        let cutoffPoint = 1+Math.floor(Math.random()*6);
        let collisions = 0;
        for (let i = 0; i < 8; i++){
            if (i < cutoffPoint){
                if (child.values[x1[i]][y1[i]])
                {
                    collisions += 1
                }
                child.values[x1[i]][y1[i]] = 1
            } else {
                if (child.values[x2[i]][y2[i]])
                {
                    collisions += 1
                }
                child.values[x2[i]][y2[i]] = 1
            }
        }
        child.fitness = child.getFitness();

        let success = 0;
        while (success < collisions){
            let x = Math.floor(Math.random()*8);
            let y = Math.floor(Math.random()*8);

            if (child.values[x][y] === 0){
                success += 1;
                child.values[x][y] = 1;
            }
        }

        return child;
    }

    twoPointCrossover(other){
        let child = this.clone();
        let x1 = [];
        let y1 = [];
        let x2 = [];
        let y2 = [];
        for (let i = 0; i < 8; i++){
            for (let j = 0; j < 8; j++){
                if (this.values[i][j] === 1){
                    x1[x1.length] = i;
                    y1[y1.length] = j;
                }
                if (other.values[i][j] === 1){
                    x2[x2.length] = i;
                    y2[y2.length] = j;
                }
                child.values[i][j] = 0;
            }
        }

        let cutoffPoint = 1+Math.floor(Math.random()*5);
        let cutoffPoint2 = cutoffPoint+1+Math.floor(Math.random()*(6-cutoffPoint));

        let collisions = 0;
        for (let i = 0; i < 8; i++){
            if (i < cutoffPoint || i > cutoffPoint2){
                if (child.values[x1[i]][y1[i]])
                {
                    collisions += 1
                }
                child.values[x1[i]][y1[i]] = 1
            } else {
                if (child.values[x2[i]][y2[i]])
                {
                    collisions += 1
                }
                child.values[x2[i]][y2[i]] = 1
            }
        }

        let success = 0;
        while (success < collisions){
            let x = Math.floor(Math.random()*8);
            let y = Math.floor(Math.random()*8);

            if (child.values[x][y] === 0){
                success += 1;
                child.values[x][y] = 1;
            }
        }

        child.fitness = child.getFitness();
        return child;
    }
}

export function validateConstrainedMatrixIndividual() {
    console.log("test generation")
    let a = new ConstrainedMatrixIndividual();

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

    let b = new ConstrainedMatrixIndividual();
    a.values = [
        [1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]
    ]
    b.values = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1]
    ]

    console.log("test 1pointCrossover")
    for (let i = 0; i < 20; i++){
        console.log(a.onepointCrossover(b).values)
    }

    console.log("test twoPointCrossover")
    for (let i = 0; i < 20; i++){
        console.log(a.twoPointCrossover(b).values)
    }

    console.log("test getPosition and getFitness")
    for (let i = 0; i < 10; i++){
        let a = new ConstrainedMatrixIndividual();
        console.log(a.values);
        console.log(a.getPosition());
        console.log(a.getFitness());
    }

}