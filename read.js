const { json } = require('express');
const lineByLine = require('n-readlines');
var fs = require("fs");

console.log(process.cwd());
const liner = new lineByLine('/Users/rpncmac2/threejslearn/public/5110_54475_sec2.txt');

let line;
let data = [];
while (line = liner.next()) 
{
    let e = line.toString().split(' ');
    data.push([Number(e[0]), Number(e[1]), Number(e[2]), Number(e[3])]);
}

let result = JSON.stringify(data);

fs.writeFileSync('data.json', JSON.stringify(result, null, 4));