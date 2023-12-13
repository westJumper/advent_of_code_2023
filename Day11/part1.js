const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var lineLength = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')

// calculated index of line that will be duplicated
var emptyLine = Array(lineLength).fill('.', 0, lineLength)
var emptyLineIndexes = []
for (let x = 0; x < input.length; x = x + lineLength) {
  var oneLine = input.slice(x, x + lineLength)

  var allEmpty = oneLine.every((char) => {
    return char == '.'
  })
  if (allEmpty) {
    emptyLineIndexes.push(x / lineLength)
  }
}

// add empty line for on the indexes (start from top to not modify the indexes)
emptyLineIndexes.reverse()
emptyLineIndexes.forEach((value) => {
  emptyLine.forEach((char) => {
    input.splice(value * lineLength + 1, 0, char)
  })
})

// calculate indexes of columns that will be added
var emptyColumnsIndexes = []
for (let x = 0; x < lineLength; x++) {
  var oneColumn = []
  var endOfFile = false
  var current = x
  while (!endOfFile) {
    if (input[current] == undefined) {
      endOfFile = true
    } else {
      oneColumn.push(input[current])
      current = current + lineLength
    }
  }

  var allEmpty = oneColumn.every((char) => {
    return char == '.'
  })

  if (allEmpty) {
    emptyColumnsIndexes.push(x)
  }
}

// calculate indexes where to add values and add from reverse
emptyColumnsIndexes.reverse() // when adding columns we need to add them from end so that we do not alter beginnning and add values to a wrong place
var columnPositionsAdd = []
emptyColumnsIndexes.forEach((column) => {
  var position = column
  while (position < input.length) {
    columnPositionsAdd.push(position)
    position = position + lineLength
  }
})
columnPositionsAdd.sort((a, b) => b - a)
columnPositionsAdd.forEach((pos) => {
  input.splice(pos, 0, '.')
})

// recalculate length of each line as we added columns (each column is + 1 for length)
lineLength = lineLength + emptyColumnsIndexes.length

var galaxiesPositions = getAllIndexes(input, '#')

// calculate sums of all shortests paths between all galaxies
var sum = 0
galaxiesPositions.forEach((galaxyPositionInInput, index) => {
  for (let i = index; i < galaxiesPositions.length - 1; i++) {
    var steps = 0
    var nextGalaxyPosition = galaxiesPositions[i + 1]

    var horizontalSteps = Math.abs(
      (galaxyPositionInInput % lineLength) - (nextGalaxyPosition % lineLength)
    )

    var verticalSteps =
      (nextGalaxyPosition -
        (nextGalaxyPosition % lineLength) -
        (galaxyPositionInInput - (galaxyPositionInInput % lineLength))) /
      lineLength

    steps = horizontalSteps + verticalSteps

    sum = sum + steps
  }
})

console.log('sum: ' + sum)

function getAllIndexes(arr, val) {
  var indexes = [],
    i
  for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i)
  return indexes
}

function outputToConsole(input, lineLength) {
  var out = ''
  input.forEach((value, index) => {
    if (index % lineLength == 0 && index != 0) {
      // one line
      console.log(out)
      out = value
    } else {
      // middle of the line
      out = out + value
    }

    // last line
    if (index == input.length - 1) {
      console.log(out)
    }
  })
}
