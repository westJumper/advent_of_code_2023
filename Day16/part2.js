const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / width

var allStartsResults = [] // all coverings for all different starting points, max is the result

// create list of all starting points
var allStarts = []
for (let i = 0; i <= height * width; i++) {
  if (i < width) {
    allStarts.push([{ positionIndex: i, direction: 'down' }])
  }
  if (i % width == 0 && i != width * height) {
    allStarts.push([{ positionIndex: i, direction: 'right' }])
  }
  if (i % width == width - 1) {
    allStarts.push([{ positionIndex: i, direction: 'left' }])
  }
  if (i > height * width - width) {
    allStarts.push([{ positionIndex: i, direction: 'up' }])
  }
}

// looping through all starting points one by one to figure out visited positions from this starting position
for (let i = 0; i < allStarts.length; i++) {
  var allVisitedPositions = new Set()
  var uniqueVisitedPositions = [] // array of all visited
  var startingPoints = allStarts[i] // instead of starting on index 0 starting at positions extracted above

  // go through all points, we can add points along a way if we hit the wall (then we split and add 2 more same positions with opposite directions)
  for (let i = 0; i < startingPoints.length; i++) {
    var positionIndex = startingPoints[i].positionIndex
    var direction = startingPoints[i].direction

    allVisitedPositions.add(positionIndex + direction)
    if (uniqueVisitedPositions.indexOf(positionIndex) == -1)
      uniqueVisitedPositions.push(positionIndex)

    var alreadyVisited = false

    while (
      positionIndex >= 0 &&
      positionIndex < input.length &&
      direction != undefined &&
      !alreadyVisited
    ) {
      allVisitedPositions.add(positionIndex + direction)

      // if we do not have
      if (uniqueVisitedPositions.indexOf(positionIndex) == -1)
        uniqueVisitedPositions.push(positionIndex)
      var nextPositionIndex
      var nextDirection = undefined
      var currentChar = input[positionIndex]

      // set next position based on the direction and current char
      switch (direction) {
        case 'right':
          if (currentChar == '.') {
            nextPositionIndex = positionIndex + 1
            nextDirection = direction
          }
          if (currentChar == '-') {
            nextPositionIndex = positionIndex + 1
            nextDirection = direction
          }
          if (currentChar == '|') {
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'up',
            })
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'down',
            })
          }
          if (currentChar == '/') {
            nextPositionIndex = positionIndex - width
            nextDirection = 'up'
          }
          if (currentChar.includes('\\')) {
            nextPositionIndex = positionIndex + width
            nextDirection = 'down'
          }
          break
        case 'down':
          if (currentChar == '.') {
            nextPositionIndex = positionIndex + width
            nextDirection = direction
          }
          if (currentChar == '-') {
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'left',
            })
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'right',
            })
          }
          if (currentChar == '|') {
            nextPositionIndex = positionIndex + width
            nextDirection = direction
          }
          if (currentChar == '/') {
            nextPositionIndex = positionIndex - 1
            nextDirection = 'left'
          }
          if (currentChar.includes('\\')) {
            nextPositionIndex = positionIndex + 1
            nextDirection = 'right'
          }
          break
        case 'left':
          if (currentChar == '.') {
            nextPositionIndex = positionIndex - 1
            nextDirection = direction
          }
          if (currentChar == '-') {
            nextPositionIndex = positionIndex - 1
            nextDirection = direction
          }
          if (currentChar == '|') {
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'up',
            })
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'down',
            })
          }
          if (currentChar == '/') {
            nextPositionIndex = positionIndex + width
            nextDirection = 'down'
          }
          if (currentChar.includes('\\')) {
            nextPositionIndex = positionIndex - width
            nextDirection = 'up'
          }
          break
        case 'up':
          if (currentChar == '.') {
            nextPositionIndex = positionIndex - width
            nextDirection = direction
          }
          if (currentChar == '-') {
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'left',
            })
            startingPoints.push({
              positionIndex: positionIndex,
              direction: 'right',
            })
          }
          if (currentChar == '|') {
            nextPositionIndex = positionIndex - width
            nextDirection = direction
          }
          if (currentChar == '/') {
            nextPositionIndex = positionIndex + 1
            nextDirection = 'right'
          }
          if (currentChar.includes('\\')) {
            nextPositionIndex = positionIndex - 1
            nextDirection = 'left'
          }
          break
        default:
          console.error('Invalid direction: ' + direction)
      }

      // if we go left from the left side or right from the right side we are out of bound
      if (
        (nextDirection == 'left' && positionIndex % width == 0) ||
        (nextDirection == 'right' && positionIndex % width == width - 1)
      ) {
        direction = undefined
      } else {
        direction = nextDirection
      }

      // figure out if we alreaady visited next position for while loop check
      alreadyVisited = allVisitedPositions.has(
        nextPositionIndex + nextDirection
      )

      // assign the next position for the next loop iteration
      positionIndex = nextPositionIndex
    }
  }

  allStartsResults.push(uniqueVisitedPositions.length)
}

console.log(Math.max(...allStartsResults))
