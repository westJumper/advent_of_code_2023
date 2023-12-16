const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var height = input.length / width

//console.log(input)
//console.log('width: ' + width)
//console.log('height: ' + height)

var allVisitedPositions = new Set()
var test = []

var startingPoints = [{ positionIndex: 0, direction: 'right' }]

for (let i = 0; i < startingPoints.length; i++) {
  //console.log('--------------------------')
  //console.log(i)
  //console.log(startingPoints.length)
  // console.log('processing starting point: ' + JSON.stringify(startingPoints[i]))
  // console.log('all starting points: ' + JSON.stringify(startingPoints))
  var positionIndex = startingPoints[i].positionIndex
  var direction = startingPoints[i].direction

  allVisitedPositions.add(positionIndex + direction)
  if (test.indexOf(positionIndex) == -1) test.push(positionIndex)

  var alreadyVisited = false

  while (
    positionIndex >= 0 &&
    positionIndex < input.length &&
    direction != undefined &&
    !alreadyVisited
    // cannot go left on start and cannot go right on end
    //  positionIndex % width == 0 &&
    // direction == 'left' &&
    // positionIndex % width == width - 1 &&
    // direction == 'right'
  ) {
    allVisitedPositions.add(positionIndex + direction)
    if (test.indexOf(positionIndex) == -1) test.push(positionIndex)
    //console.log(allVisitedPositions)

    // console.log(
    //   'current position: ' +
    //     positionIndex +
    //     ' direction to: ' +
    //     direction +
    //     ' char: ' +
    //     input[positionIndex]
    // )
    var nextPositionIndex
    var nextDirection = undefined
    var currentChar = input[positionIndex]
    switch (direction) {
      case 'right':
        // console.log('currentChar: ' + currentChar)
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
        //  console.log('currentChar: ' + currentChar)
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
        //   console.log('currentChar: ' + currentChar)
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
        //  console.log('currentChar: ' + currentChar)
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

    if (
      (nextDirection == 'left' && positionIndex % width == 0) ||
      (nextDirection == 'right' && positionIndex % width == width - 1)
    ) {
      //console.log('one the left or right')
      direction = undefined
    } else {
      direction = nextDirection
    }

    alreadyVisited = allVisitedPositions.has(nextPositionIndex + nextDirection)

    //console.log('next direction: ' + nextDirection)
    // console.log('next position index: ' + nextPositionIndex)
    positionIndex = nextPositionIndex
  }
}

//console.log('all visited positions: ' + allVisitedPositions.size)
//console.log(allVisitedPositions)
console.log(test.length)

var line = ''
var char = ''
for (let i = 0; i <= height * width; i++) {
  if (i % width == 0) {
    console.log(line)
    line = ''
  }
  if (test.indexOf(i) != -1) {
    char = '#'
  } else {
    char = input[i]
  }
  line = line + char
}
