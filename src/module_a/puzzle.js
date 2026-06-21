/* array = holding values
 

let fruits = ["apple", "orange", "banana"];


console.log(fruits);
console.log(fruits[0]);
console.log(fruits[2]);

fruits.push("coco");
console.log(fruits);

fruits.pop();
console.log(fruits);

fruits.unshift("mango");
console.log(fruits);

fruits.shift();
console.log(fruits);

let numOfFruits = fruits.length;
let index = fruits.indexOf("orange")
let missingIndex = fruits.indexOf("Pear")

console.log(numOfFruits);
console.log(index);
console.log(missingIndex);
*/

let goal_State = ([[1,2,3],[4,5,6],[7,8,0]]);

let starting_State = ([[3,1,2],[0,4,6],[8,7,5]]);


function findBlankSlot(state){
//trying to loop through the starting state and locate where 0 is 
// will return col and row so we can then use it in the find legal moves function
//we first set the range for the loop 3 x 3 , we go through first array, if not found we move to the next array
    for(row = 0; row < 3; row ++){
        for(col = 0; col < 3; col++){
            if(state[row][col] === 0){
                return [row,col];
            }
        }
    }
}



function identifyLegalMoves(state){
// Approach to this is to use somthing similar  to what we caw in the lecture (row,col)
// there are 4 edges per node / vertex, we will try up, down, left , and right (this requires either adding 1 or subtracting 1)
//if the result of the addition / subtraction is no in the legal range of (0,0) to (2,2), we can assume its an illegal move if the code ran right lol
    zeroLocation = findBlankSlot(state);
    [row,col] = zeroLocation;

    // list of moves
    directions = [
        [-1,0], // up move
        [1,0], // down move
        [0,-1], // left move
        [0,1] // right move
    ];
    
    // sotrinng these moves after checking 
    legalMoves=[];

    for(i = 0; i < 4; i++){
        //this is to acces the 2d aray and find the change
        rowChange = directions[i][0];
        colChange = directions[i][1];
        // add the change
        newRow = row + rowChange;
        newCol = col + colChange;

        //validating check
        if (newRow >=0 && newRow <= 2 && newCol >= 0 && newCol <= 2){
            legalMoves.push([newRow, newCol]) // add to list if we can validate its withinh the 3x3 bounds
        }
    
    }

    return legalMoves;
}

// making the actual change of tiles
function swapTiles(currentState, newRow, newCol){
    newState = [];

    [row,col] = findBlankSlot(currentState);

    for(i = 0; i<3; i++){
        newState[i] = [];
        for(j = 0; j<3; j++){
            newState[i][j] = currentState[i][j];
        }
    }
    //swapping using a temp
    temp = newState[row][col];
    newState[row][col] = newState[newRow][newCol];
    newState[newRow][newCol] = temp;

    return newState;
    
}
// chekcign to see if we have found the goal
function checkIfGoalReached(currentState){
        for (row = 0; row < 3; row++) {
            for (col = 0; col < 3; col++) {
                    // checking invidual tiels
                if (currentState[row][col] !== goal_State[row][col]){
                    return false;  //stop immediately if one is w2orng 
            }

        }
    }
    return true; // found all tiles are correct
}
// cahnge current board into a string so we can save to check if already cchecked  
function boardToString(state){

    result ='';
    for (row = 0; row <3; row++){
        for(col = 0; col <3; col++){
            result = result + state[row][col] +',';
        }
    }
}
// finding the path the algorithm takes to soltion
function traceSolution(node){
    path = [];
    while (node.parent !== null){
        path.unshift(node.state);
        node = node.parent;
    }
    path.unshift(node.state);
    return path;
}
console.log(findBlankSlot(starting_State));
console.log(findBlankSlot(goal_State));


