/**
 * For anyone reading this and trying to understand - good luck :)
 * It is a quick and dirty solution. I would love to refactor it but it is just not worth it.
 * Based on the examples I figured that even pipe that is not in the loop can be nest, not only ground.
 * Then the calculation for tile inside a loop is that from one direction (in this case left to right but it would work in any direction)
 * When we start on the left and keep track if we are in the loop or outside
 * by switching a boolean variable everytime we hit the pipe that gets us inside a loop or out
 * in our case the pipe is either 'F' or'7' or '|'
 * when we hit the ground or pipe that is not in the loop we check the current boolean variable
 * if variable is true (inside) we add the tile as possible nest.
 * We reset the switch boolean variable at the start of each line.
 * Idea is also described in pseudocode and by picture in here: https://www.reddit.com/r/adventofcode/comments/18fgddy/comment/kcvqh9e/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
 */

const f = require('fs')
var inputFile = 'testPart2.txt'

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
var input = data.replaceAll('\r\n', '')
var inputLength = input.length
var startingPosition = input.indexOf('S')

var allPositions = [] // keep positions of loop tiles from the input

// calculate step at the beginning
var currentPosition = [startingPosition, startingPosition]
var previousPosition = [startingPosition, startingPosition]
var next
let startPositionChar = ''
var result

// step 1 - one direction - like a band :)
result = nextPositionFromStartAndStartCharacter(currentPosition[0], [
  previousPosition[0],
])
next = result[0]
startPositionChar = result[1]
input[startingPosition] = startPositionChar

previousPosition[0] = currentPosition[0]
currentPosition[0] = next

allPositions.push(currentPosition[0])
allPositions.push(currentPosition[1])

// step 2 - opposite direction => filter out possible position on step 1
result = nextPositionFromStartAndStartCharacter(currentPosition[1], [
  previousPosition[1],
  currentPosition[0],
])
next = result[0]
currentPosition[1] = next

var counter = 1 // starting from 1 as above move into 2 directions is already one step

// add first move into positions with loop tiles
allPositions.push(currentPosition[0])
allPositions.push(currentPosition[1])

// set starting position real character
var intersection = false
while (!intersection) {
  counter++

  for (let i = 0; i < 2; i++) {
    // find next step for one and other side of the loop
    next = nextStep(currentPosition[i], [previousPosition[i]])
    previousPosition[i] = currentPosition[i]
    currentPosition[i] = next
  }

  allPositions.push(currentPosition[0])
  allPositions.push(currentPosition[1])

  // check if we have intersection
  intersection = isIntersection(currentPosition)
}

calculatePossibleNests(allPositions)

function calculatePossibleNests(allPositionsWithLoopTiles) {
  var line = ''
  var currentChar = ''
  var isInside = false
  var sum = 0
  for (let i = 0; i <= inputLength; i++) {
    if (i % lineLength == 0 && i != 0) {
      isInside = false
      line = ''
    }

    var isLoopTile = allPositionsWithLoopTiles.includes(i)

    currentChar = i == startingPosition ? startPositionChar : input[i]
    line = line + currentChar

    if (!isLoopTile && isInside) sum++
    if (
      isLoopTile &&
      (currentChar == 'F' || currentChar == '7' || currentChar == '|')
    )
      isInside = !isInside
  }
  console.log('nests: ' + sum)
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

function nextPositionFromStartAndStartCharacter(position, filterPrevious) {
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
  var possibleStartPosition = []
  if (possibleNextMoves.top.indexOf(topPipeType) != -1) {
    possibleMoves.push(topPipePosition)
    possibleStartPosition.push(possibleNextMoves.bottom)
  }

  if (possibleNextMoves.bottom.indexOf(bottomPipeType) != -1) {
    possibleMoves.push(bottomPipePosition)
    possibleStartPosition.push(possibleNextMoves.top)
  }

  if (possibleNextMoves.left.indexOf(leftPipeType) != -1 && !outOfBoundLeft) {
    possibleMoves.push(leftPipePosition)
    possibleStartPosition.push(possibleNextMoves.right)
  }

  if (
    possibleNextMoves.right.indexOf(rightPipeType) != -1 &&
    !outOfBoundRight
  ) {
    possibleMoves.push(rightPipePosition)
    possibleStartPosition.push(possibleNextMoves.left)
  }

  var nextMove = possibleMoves.filter((move) => {
    if (filterPrevious.indexOf(move) != -1) return false
    return true
  })[0]

  var startPositionChar = ''
  if (possibleStartPosition.length == 2) {
    startPositionChar = possibleStartPosition[0].filter((value) => {
      return possibleStartPosition[1].includes(value)
    })[0]
  }

  return [nextMove, startPositionChar]
}
