const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var instructions = []
var coordinates = []

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
      break

    default:
      break
  }
})

reader.on('close', function () {
  var current = 'AAA'
  var counter = 0
  var currentArrowPointer

  while (current != 'ZZZ') {
    currentArrowPointer = instructions[counter % instructions.length]
    current = coordinates.find((obj) => {
      return obj.name == current
    })[currentArrowPointer]

    counter++
  }

  console.log('Counter: ' + counter)
})

function lineType(line) {
  if (line[4] === '=') return 'instructions'
  if (line.length == 0) return 'empty'
  return 'first'
}
