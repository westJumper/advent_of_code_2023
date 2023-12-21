const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var startPosition = input.indexOf('S')
var steps = 64
console.log('starting position: ' + startPosition)

var positions = [startPosition]
var nextPositions = new Set()

// do it as many times as we want (steps)
for (let i = 0; i < steps; i++) {
  while (positions.length != 0) {
    var currentPosition = positions.shift()

    var possiblePositions = [
      currentPosition - width,
      currentPosition + 1,
      currentPosition + width,
      currentPosition - 1,
    ]

    possiblePositions.forEach((position) => {
      if (input[position] == '.') {
        nextPositions.add(position)
      }
    })
  }

  nextPositions.forEach((position) => {
    positions.push(position)
  })

  // show where he can be at the very last step
  if (i == steps - 1) {
    console.log('possible positions: ' + (nextPositions.size + 1))
    showVisual(nextPositions)
  }
  nextPositions = new Set() // reset
}

function showVisual(nextPositions) {
  console.log('-------------visual--------------')
  console.log(nextPositions)
  var line = ''
  var char = ''
  for (let i = 0; i <= input.length; i++) {
    if (i % width == 0) {
      console.log(line)
      line = ''
    }
    if (nextPositions.has(i)) {
      char = 'O'
    } else {
      char = input[i]
    }
    line = line + char
  }
}
