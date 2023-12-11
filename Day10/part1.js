const f = require('fs')
var inputFile = 'test.txt'

var data = f.readFileSync(inputFile).toString()

/**
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */
var possibleNextMoves = {
  top: ['|', '7', 'F'],
  left: ['-', 'L', 'F'],
  right: ['-', 'J', '7'],
  bottom: ['|', 'J', 'L'],
}

var lineLength = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var counter = 0
var input = data.replaceAll('\r\n', '')
var startingPosition = input.indexOf('S')

// calculate step at the beginning
var currentPosition = [startingPosition, startingPosition]
var previousPosition = [startingPosition, startingPosition]
var next

// step 1
next = nextStepForStart(
  currentPosition[0],
  [previousPosition[0]],
  possibleNextMoves
)
previousPosition[0] = currentPosition[0]
currentPosition[0] = next

// step 2 (filter out possible position on step 1)
next = nextStepForStart(
  currentPosition[1],
  [previousPosition[1], currentPosition[0]],
  possibleNextMoves
)
currentPosition[1] = next
counter++ // increase one for above step

var intersection = false
while (!intersection) {
  counter++

  for (let i = 0; i < 2; i++) {
    // find next steps from
    next = nextStep(currentPosition[i], [previousPosition[i]])
    previousPosition[i] = currentPosition[i]
    currentPosition[i] = next
  }

  // check if we have intersection
  intersection = isIntersection(currentPosition)
  if (intersection) {
    console.log('steps: ' + counter)
  }
}

function isIntersection(currentPosition) {
  return currentPosition[0] == currentPosition[1]
}

/**
 * | is a vertical pipe connecting north and south.
 * - is a horizontal pipe connecting east and west.
 * L is a 90-degree bend connecting north and east.
 * J is a 90-degree bend connecting north and west.
 * 7 is a 90-degree bend connecting south and west.
 * F is a 90-degree bend connecting south and east.
 * . is ground; there is no pipe in this tile.
 * S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
 */
function nextStep(position, filterPrevious) {
  var possibleMoves = []
  var currentPositionType = input[position]
  switch (currentPositionType) {
    case '|':
      possibleMoves.push(position - lineLength)
      possibleMoves.push(position + lineLength)
      break
    case '-':
      possibleMoves.push(position - 1)
      possibleMoves.push(position + 1)
      break
    case 'L':
      possibleMoves.push(position - lineLength)
      possibleMoves.push(position + 1)
      break
    case 'J':
      possibleMoves.push(position - lineLength)
      possibleMoves.push(position - 1)
      break
    case '7':
      possibleMoves.push(position + lineLength)
      possibleMoves.push(position - 1)
      break
    case 'F':
      possibleMoves.push(position + lineLength)
      possibleMoves.push(position + 1)
      break
    default:
      break
  }

  var nextMove = possibleMoves.filter((move) => {
    if (filterPrevious.indexOf(move) != -1) return false
    return true
  })[0]

  return nextMove
}

function nextStepForStart(position, filterPrevious, possibleNextMoves) {
  var topPipeType = input[position - lineLength]
  var topPipePosition = position - lineLength
  var bottomPipeType = input[position + lineLength]
  var bottomPipePosition = position + lineLength
  var leftPipeType = input[position - 1]
  var leftPipePosition = position - 1
  var rightPipeType = input[position + 1]
  var rightPipePosition = position + 1
  var outOfBoundLeft = position % lineLength == 0 ? true : false
  var outOfBoundRight = position % lineLength == lineLength - 1 ? true : false

  var possibleMoves = []
  if (possibleNextMoves.top.indexOf(topPipeType) != -1) {
    possibleMoves.push(topPipePosition)
  }

  if (possibleNextMoves.bottom.indexOf(bottomPipeType) != -1) {
    possibleMoves.push(bottomPipePosition)
  }

  if (possibleNextMoves.left.indexOf(leftPipeType) != -1 && !outOfBoundLeft) {
    possibleMoves.push(leftPipePosition)
  }

  if (
    possibleNextMoves.right.indexOf(rightPipeType) != -1 &&
    !outOfBoundRight
  ) {
    possibleMoves.push(rightPipePosition)
  }

  var nextMove = possibleMoves.filter((move) => {
    if (filterPrevious.indexOf(move) != -1) return false
    return true
  })[0]

  return nextMove
}
