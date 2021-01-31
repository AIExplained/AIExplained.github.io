import {position_to_column_vector, field_to_index, index_to_field, example_positions, column_vector_to_position,
    random_vector, createVector, index_to_col_name, random_permutation} from "./chessboard_utils.js";

// initialize crossover result
let vector1 = createVector(random_permutation(), "#cycle-crossover-parent-1");
let vector2 = createVector(random_permutation(), "#cycle-crossover-parent-2");
let cycle_vector = createVector(random_permutation(), "#cycle-crossover-cycle-vector");
let divsParent1 = $(vector1).find("div");
let divsParent2 = $(vector2).find("div");
let divsCycles = $(cycle_vector).find("div");

//updateVectors(rangeInput.getAttribute("value"), divsParent1, divsParent2);
cycle_detection(divsParent1, divsParent2, divsCycles);

function cycle_detection(divsParent1, divsParent2, divsCycles){
    let parent1 = [];
    let parent2 = [];
    let cycles = [];
    for (let i = 0; i < 8; i++){
        parent1[i] = parseInt(divsParent1[i].innerHTML);
        parent2[i] = parseInt(divsParent2[i].innerHTML);
        cycles[i] = 0;
    }

    let cycleNumber = 1;
    for (let i = 0; i < 8; i++){
        if (cycles[i] === 0){
            let cycle_indices = get_cycle_indices(i, parent1, parent2);
            console.log(cycle_indices);
            for (let index in cycle_indices)
            {
                cycles[cycle_indices[index]] = cycleNumber;
            }
            cycleNumber++;
        }
    }

    for (let i = 0; i < 8; i++){
        divsCycles[i].innerHTML = cycles[i];
    }
}

function get_cycle_indices(start_index, parent1, parent2){
    let cycle_indices = [start_index];
    let current_value = null;
    let current_index = start_index;
    while (true){
        current_value = parent2[current_index];
        current_index = parent1.indexOf(current_value);

        if (current_index === start_index)
            return cycle_indices;

        cycle_indices = cycle_indices.concat([current_index]);
    }
}

function updateVectors(value, divsParent1, divsParent2){
    //retrieve the x first elements#
    /*
    let newVector = [];
    for (let i = 0; i < 8; i++){
        if (i < value){
            // read value
            newVector[i] = 8-parseInt(divsParent1[i].innerHTML);

            //newVector[i] = $(vector2).find("div")[i].style.backgroundColor = "#ffffff";
            divsParent2[i].classList.add("inactive");
            divsParent2[i].classList.remove("active");

            divsParent1[i].classList.add("active");
            divsParent1[i].classList.remove("inactive");

            const style = getComputedStyle(divsParent1[i]);
            divsChild[i].style.backgroundColor = style["background-color"];
        } else {
            // read value
            newVector[i] = 8-parseInt(divsParent2[i].innerHTML);

            divsParent2[i].classList.add("active");
            divsParent2[i].classList.remove("inactive");

            divsParent1[i].classList.add("inactive");
            divsParent1[i].classList.remove("active");

            const style = getComputedStyle(divsParent2[i]);
            divsChild[i].style.backgroundColor = style["background-color"];
        }

        divsChild[i].innerHTML = 8-newVector[i];
    }
    //console.log(newVector, column_vector_to_position(newVector));

    boards[2].position(column_vector_to_position(newVector));#

     */
}





