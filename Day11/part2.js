const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var lineLength = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')

var galaxyExpandRation = 1000000

// calculated index of line that will be duplicated
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

var galaxiesPositions = getAllIndexes(input, '#')

// calculate sums of all shortests paths between all galaxies
var sum = 0
galaxiesPositions.forEach((galaxyPositionInInput, index) => {
  for (let i = index; i < galaxiesPositions.length - 1; i++) {
    var steps = 0
    var nextGalaxyPosition = galaxiesPositions[i + 1]

    var currentColumn = galaxyPositionInInput % lineLength
    var nextColumn = nextGalaxyPosition % lineLength

    var leftToRightOrViceVersa = [
      Math.min(currentColumn, nextColumn),
      Math.max(currentColumn, nextColumn),
    ]

    var currentLine =
      (galaxyPositionInInput - (galaxyPositionInInput % lineLength)) /
      lineLength
    var nextLine =
      (nextGalaxyPosition - (nextGalaxyPosition % lineLength)) / lineLength
    var upToDown = [
      Math.min(currentLine, nextLine),
      Math.max(currentLine, nextLine),
    ]

    var horizontalSteps = Math.abs(
      (galaxyPositionInInput % lineLength) - (nextGalaxyPosition % lineLength)
    )

    var numberOfGalaxiesThatExpandedHorizontaly = emptyColumnsIndexes.filter(
      (galaxyIndex) => {
        return (
          galaxyIndex > leftToRightOrViceVersa[0] &&
          galaxyIndex < leftToRightOrViceVersa[1]
        )
      }
    ).length

    horizontalSteps =
      horizontalSteps +
      numberOfGalaxiesThatExpandedHorizontaly * galaxyExpandRation

    var verticalSteps =
      (nextGalaxyPosition -
        (nextGalaxyPosition % lineLength) -
        (galaxyPositionInInput - (galaxyPositionInInput % lineLength))) /
      lineLength

    var numberOfGalaxiesThatExpandedVertically = emptyLineIndexes.filter(
      (galaxyIndex) => {
        return galaxyIndex > upToDown[0] && galaxyIndex < upToDown[1]
      }
    ).length

    verticalSteps =
      verticalSteps +
      numberOfGalaxiesThatExpandedVertically * galaxyExpandRation

    steps =
      horizontalSteps +
      verticalSteps -
      numberOfGalaxiesThatExpandedHorizontaly -
      numberOfGalaxiesThatExpandedVertically // deduct galaxies we expanded

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
