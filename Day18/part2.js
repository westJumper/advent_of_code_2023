const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.split('\r\n')

var corners = [[0, 0]]
var moves = {
  3: [0, -1],
  0: [1, 0],
  1: [0, 1],
  2: [-1, 0],
}

var numberOfCorners = 0
input.forEach((line) => {
  var [_, _, color] = line.split(' ')
  var hexaStep = color.substring(2, 7)
  var direction = color.substring(7, 8)
  var steps = parseInt(hexaStep, 16)
  var move = moves[direction]

  numberOfCorners = numberOfCorners + steps
  var lastCoordinate = corners[corners.length - 1]
  var x = lastCoordinate[0] + move[0] * steps
  var y = lastCoordinate[1] + move[1] * steps
  corners.push([x, y])
})

// shoelace formula
// - https://en.wikipedia.org/wiki/Shoelace_formula
// - weird calculation from this video where he explains it https://www.youtube.com/watch?v=bxNVXQNMA7o
var area = 0
for (let i = 0; i < corners.length - 1; i++) {
  var current = corners[i]
  var next = corners[i + 1]
  area = area + (next[0] - current[0]) * (next[1] + current[1])
}
var result = Math.abs(Number(area)) / 2 + numberOfCorners / 2 + 1
console.log('result: ' + result)
