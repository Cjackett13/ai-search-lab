// array = holding values
// 

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