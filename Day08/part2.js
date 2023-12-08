const f = require('fs')
const readline = require('readline')
var inputFile = 'testPart2.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var instructions = []
var coordinates = []
var currentPositions = []

reader.on('line', function (line) {
  switch (lineType(line)) {
    case 'first':
      line.split('').forEach((instruction) => {
        instructions.push(instruction)
      })
      break
    case 'instructions':
      coordinates.push({
        name: line.substring(0, 3),
        L: line.substring(7, 10),
        R: line.substring(12, 15),
      })
      if (line.substring(2, 3) == 'A') {
        currentPositions.push(line.substring(0, 3))
      }
      break
    default:
      break
  }
})
var leastStepsForEach = []
reader.on('close', function () {
  var counter = 0
  var currentArrowPointer
  var allPositionsEndWithZ = false

  while (currentPositions.length > 0) {
    currentArrowPointer = instructions[counter % instructions.length]
    counter++ // insrease counter immediatly as current processing is with the next position

    var nextPositions = []

    for (let i = 0; i < currentPositions.length; i++) {
      var current = currentPositions[i]
      current = coordinates.find((obj) => {
        return obj.name == current
      })[currentArrowPointer]
      nextPositions.push(current)
    }

    // if end is found add counter it to list to see how many steps it took and remove this node from processing
    // if end is not found continue with processing next round
    currentPositions = []
    nextPositions.forEach((position) => {
      if (position.substring(2, 3) == 'Z') {
        leastStepsForEach.push(counter)
      } else {
        currentPositions.push(position)
      }
    })
  }

  console.log('Least steps for each node to find Z: ' + leastStepsForEach)

  const gcd = (a, b) => (a ? gcd(b % a, a) : b) // greatest common divisor alg.
  const lcm = (a, b) => (a * b) / gcd(a, b) // least common multiple alg.

  console.log(leastStepsForEach.reduce(lcm))
})

function lineType(line) {
  if (line[4] === '=') return 'instructions'
  if (line.length == 0) return 'empty'
  return 'first'
}
