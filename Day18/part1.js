const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.split('\r\n')

var coordinates = [[0, 0]]
var moves = {
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
}

var maxX = 0
var maxY = 0
var minX = 0
var minY = 0
input.forEach((line) => {
  var [direction, steps, color] = line.split(' ')
  steps = Number(steps)
  var move = moves[direction]

  for (let i = 0; i < steps; i++) {
    var lastCoordinate = coordinates[coordinates.length - 1]
    var x = lastCoordinate[0] + move[0]
    var y = lastCoordinate[1] + move[1]
    coordinates.push([x, y])

    maxX = Math.max(x, maxX)
    maxY = Math.max(y, maxY)
    minX = Math.min(x, minX)
    minY = Math.min(y, minY)
  }
})

// show the result
var line = ''
var sum = 0
var isInside = false
for (let y = minY; y <= maxY; y++) {
  for (let x = minX; x <= maxX; x++) {
    var isEdge = coordinates.find(
      (coordinate) => coordinate[0] == x && coordinate[1] == y
    )
    var hasBottom = coordinates.find(
      (coordinate) => coordinate[0] == x && coordinate[1] == y - 1
    )
    var hasTop = coordinates.find(
      (coordinate) => coordinate[0] == x && coordinate[1] == y + 1
    )
    var hasLeft = coordinates.find(
      (coordinate) => coordinate[0] == x - 1 && coordinate[1] == y
    )
    var hasRight = coordinates.find(
      (coordinate) => coordinate[0] == x + 1 && coordinate[1] == y
    )

    if (isEdge || isInside) sum++
    if (
      isEdge &&
      ((hasBottom && hasRight) ||
        (hasBottom && hasLeft) ||
        (hasBottom && hasTop))
    )
      isInside = !isInside // same concept applied as for day 10 part 2

    if (isEdge || isInside) {
      line = line + '#'
    } else {
      line = line + '.'
    }
  }
  isInside = false
  console.log(line)
  line = ''
}
console.log('sum: ' + sum)
