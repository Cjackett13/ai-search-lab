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

function getLegalMoves(state){
// Approach to this is to use somthing similar  to what we caw in the lecture (row,col)
// there are 4 edges per node / vertex, we will try up, down, left , and right (this requires either adding 1 or subtracting 1)
//if the result of the addition / subtraction is no in the legal range of (0,0) to (2,2), we can assume its an illegal move if the code ran right lol

}

console.log(findBlank(starting_State));
console.log(findBlank(goal_State));


