export var squareClass = 'square-55d63';

/**
 * a dictionary for transforming a chess notation column into a column-index
 */
export const col_name_to_index = {
    "a": 0,
    "b": 1,
    "c": 2,
    "d": 3,
    "e": 4,
    "f": 5,
    "g": 6,
    "h": 7,
};

/**
 * a dictionary for transforming a column-index into a chess notation column
 */
export const index_to_col_name = {
    0 : "a",
    1 : "b",
    2 : "c",
    3 : "d",
    4 : "e",
    5 : "f",
    6 : "g",
    7 : "h",
};

/**
 * Determines if the provided position is safe or in threat by another queen.
 *
 * @param binary_board: a binary representation of the board, in which 1 equals a queen and 0 and empty field
 * @param row: the row index of the position to be checked
 * @param col: the column index of the position to be checked
 * @returns {boolean}
 */
export function isSafe(binary_board, row, col){
    // Checks left and right
    for(let i=0; i<8; i++){
        if (i === col)
            continue;
        if (binary_board[row][i] === 1) {
            return false;
        }
    }

    // Checks up and down
    for(let j=0; j<8; j++){
        if (j === row)
            continue;
        if (binary_board[j][col] === 1) {
            return false;
        }
    }

    // Checks the ↖ direction
    for(let i=row-1, j=col-1; i>=0 && j>=0; i--, j--){
        if (binary_board[i][j] === 1) {
            return false;
        }
    }
    for(let i=row+1, j=col+1; i<8 && j<8; i++, j++){
        if (binary_board[i][j] === 1) {
            return false;
        }
    }

    // Checks the ↙ direction
    for(let i=row+1, j=col-1; j>=0 && i<8; i++, j--){
        if (binary_board[i][j] === 1){
            return false;
        }
    }
    for(let i=row-1, j=col+1; i>=0 && j<8; i--, j++){
        if (binary_board[i][j] === 1){
            return false;
        }
    }

    return true;
}

/**
 * gets the board position provided by chessboard.js and returns a column vector in which each cell indicates the
 * queen's row of the column with the same index
 * @param position: position json object provided by chessboard.js
 * @returns {[]}
 */
export function position_to_column_vector(position){
    let binary_board = position_to_binary_board(position)[0];
    let vector_board = [];
    for(let i=0; i<8; i++){
        vector_board[i] = -1;
        for(let j=0; j<8; j++){
            if (binary_board[j][i]===1)
            {
                vector_board[i] = 8-j;
            }
        }
    }
    return vector_board;
}

/**
 * gets the board position provided by chessboard.js and returns a row vector in which each cell indicates the
 * queen's column of the row with the same index
 * @param position: position json object provided by chessboard.js
 * @returns {[]}
 */
export function position_to_row_vector(position){
    let binary_board = position_to_binary_board(position)[0];
    let vector_board = [];
    for(let i=0; i<8; i++){
        vector_board[i] = "z";
        for(let j=0; j<8; j++){
            if (binary_board[i][j]===1)
            {
                vector_board[i] = index_to_col_name[j];
            }
        }
    }
    return vector_board;
}

/**
 * column vector in which each cell indicates the queens row of the column with the same index is
 * mapped to board position provided by chessboard.js
 * @param column_vector:
 * @returns position json object provided by chessboard.js {[]}
 */
export function column_vector_to_position(column_vector){
    let position = {};

    for(let i=0; i<8; i++){
        let board_index = index_to_col_name[i] + (8-column_vector[i]);
        position[board_index] = "bQ";
    }
    return position;
}


/**
 *
 * @param position
 * @returns {[][]}
 */
export function position_to_binary_board(position){
    var binary_board=[];
    for(let i=0; i<8; i++){
        binary_board[i]=[];
        for(let j=0; j<8; j++){
            binary_board[i][j]=0;
        }
    }

    for (let pos in position){
        let row = 8-parseInt(pos[1]);
        let col = col_name_to_index[pos[0]];
        binary_board[row][col] = 1;
    }

    let unsafe_positions = [];
    let safe_positions = [];
    let i = 0;
    let j = 0;
    for (let pos in position) {
        let row = 8 - parseInt(pos[1]);
        let col = col_name_to_index[pos[0]];
        if (!isSafe(binary_board, row, col)){
            unsafe_positions[i] = pos;
            i++;
        } else {
            safe_positions[j] = pos;
            j++;
        }
    }

    return [binary_board, unsafe_positions, safe_positions];
}

export function getSafeAndUnsafePosition(binary_board) {
    let unsafe_positions = [];
    let safe_positions = [];
    let i = 0;
    let j = 0;
    let position = binary_board_to_position(binary_board)

    for (let pos in position) {
        let row = 8 - parseInt(pos[1]);
        let col = col_name_to_index[pos[0]];
        if (!isSafe(binary_board, row, col)){
            unsafe_positions[i] = pos;
            i++;
        } else {
            safe_positions[j] = pos;
            j++;
        }
    }

    return [unsafe_positions, safe_positions];
}


/**
 *
 * @param binary_board
 * @returns {""}
 */
export function binary_board_to_position(binary_board){
    let position = {};
    for(let i=0; i<8; i++){

        for(let j=0; j<8; j++){
            if (binary_board[i][j]==="1" || binary_board[i][j]===1){
                let row = 8-j;
                let column = index_to_col_name[i];
                position[column+row] = "bQ";
            }
        }
    }

    return position;
}



/**
 * Removes the css class of all cells of the provided board and adds threatcssclass and safecssclass according to the
 * safety of each queens position.
 *
 * @param $board: the jquery board object
 * @param position: the position json object provided by chessboard.js
 * @param threatcssclass: the css class to be added to a square in threat
 * @param safecssclass: the css class to be added to a safe square
 */
export function highlightCollisions($board, position, threatcssclass="highlight-red", safecssclass="highlight-green") {
    // transfer to binary board
    const [_, unsafe_positions, safe_positions] = position_to_binary_board(position);

    // find all squared to be highlighted
    $board.find('.' + squareClass).removeClass('highlight-red');
    $board.find('.' + squareClass).removeClass('highlight-green');
    for (let pos in unsafe_positions){
        $board.find('.' + squareClass+".square-"+unsafe_positions[pos]).addClass(threatcssclass)
    }
    if (safe_positions.length === 8)
    {
        for (let pos in safe_positions){
            $board.find('.' + squareClass+".square-"+safe_positions[pos]).addClass(safecssclass)
        }
    }
}

export function highlightPosition($board, positions, threatcssclass="highlight-red") {
    for (let pos in positions){
        $board.find('.' + squareClass+".square-"+pos).addClass(threatcssclass)
    }
}

/**
 *
 * @param fieldname
 * @returns {*}
 */
export function field_to_index(fieldname){
    let row = 8 - parseInt(fieldname[1]);
    let col = col_name_to_index[fieldname[0]];
    return row*8+col;
}

/**
 *
 * @param index
 * @returns {*}
 */
export function index_to_field(index){
    let row = 8 - Math.floor(index/8) ;
    let col = index_to_col_name[index%8];
    return col+row;
}

/**
 *
 * @returns {[]}
 */
export function random_vector(){
    let x = [];
    for (let i = 0; i < 8; i++){
        x[i] = Math.floor(Math.random() * 8);
    }
    return x;
}

export function random_permutation(){
    let x = [];
    for (let i = 0; i < 8; i++){
        x[i] = i+1;
    }

    return shuffle(x);
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


export const example_positions = [
    {
        a1: "bQ",
        b2: "bQ",
        c3: "bQ",
        d4: "bQ",
        e5: "bQ",
        f6: "bQ",
        g7: "bQ",
        h8: "bQ"
    },
    {
        a4: "bQ",
        b4: "bQ",
        c4: "bQ",
        d4: "bQ",
        e5: "bQ",
        f5: "bQ",
        g5: "bQ",
        h5: "bQ"
    },
    {
        a6: "bQ",
        b2: "bQ",
        c8: "bQ",
        d4: "bQ",
        e5: "bQ",
        f1: "bQ",
        g7: "bQ",
        h3: "bQ"
    },
    {
        d8: "bQ",
        d7: "bQ",
        d6: "bQ",
        d5: "bQ",
        e4: "bQ",
        e3: "bQ",
        e2: "bQ",
        e1: "bQ"
    },
    {
        a6: "bQ",
        b7: "bQ",
        c4: "bQ",
        d2: "bQ",
        e1: "bQ",
        f8: "bQ",
        g3: "bQ",
        h5: "bQ"
    },
    {
        d8: "bQ",
        d1: "bQ",
        d7: "bQ",
        d2: "bQ",
        e6: "bQ",
        e3: "bQ",
        e5: "bQ",
        e4: "bQ"
    },
    {
        a6: "bQ",
        b5: "bQ",
        c2: "bQ",
        d8: "bQ",
        e3: "bQ",
        f4: "bQ",
        g1: "bQ",
        h7: "bQ"
    },
];


export function createVector(tableData, target) {
    let table = document.createElement('table');
    let tableBody = document.createElement('tbody');

    let i = 0;
    tableData.forEach(function(rowData) {
        let cell = document.createElement('div');
        cell.appendChild(document.createTextNode(rowData));
        cell.setAttribute("childIndex", i);
        if ($(target).hasClass("active"))
            cell.classList.add("active");
        tableBody.appendChild(cell);
        i = i+1;
    });

    table.appendChild(tableBody);
    $(target)[0].appendChild(table);
    return table;
}


/**
 *
 * @param tableData
 * @param tableContainer
 * @returns {HTMLTableElement}
 */
export function createMatrix(tableData, tableContainer) {
    var matrix = document.createElement('table');
    var tableBody = document.createElement('tbody');

    let i = 0;
    tableData.forEach(function(rowData) {
        rowData.forEach(function(cellData) {
            var cell = document.createElement('div');
            cell.appendChild(document.createTextNode(cellData));
            cell.setAttribute("childIndex", i);
            if ($(tableContainer).hasClass("active"))
                cell.classList.add("active");
            tableBody.appendChild(cell);
            i = i+1;
        });

        //tableBody.appendChild(row);
    });

    matrix.appendChild(tableBody);
    $(tableContainer)[0].appendChild(matrix);
    return matrix;
}
