const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var width = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
var input = data.replaceAll('\r\n', '').split('')
var endPosition = input.length - 1 // this is also end position

// indexes of those positions
var seen = new Set()

// current heap loss, current position, direction, number of steps in the same direction
var queue = [
  [Number(input[1]), 1, 'right', 1, [1]],
  [Number(input[width]), width, 'bottom', 1, [width]],
]

while (queue.length != 0) {
  // sort queue to take the lowest in heap loss steps and continue from there
  queue.sort((a, b) => {
    return a[0] - b[0]
  })

  // load values of the chosen lowest heap loss
  var currentqueue = queue.shift()
  var [heapLoss, currentPosition, direction, stepsInSameDirection, allVisited] =
    currentqueue

  // if we reached the end position we found a winner - break a loop
  if (currentPosition == endPosition && stepsInSameDirection >= 4) {
    console.log('final result heap loss: ' + heapLoss)
    console.log(allVisited)
    // show the visual
    var line = ''
    var char = ''
    for (let i = 0; i <= endPosition + 1; i++) {
      if (i % width == 0) {
        console.log(line)
        line = ''
      }
      if (allVisited.indexOf(i) != -1) {
        char = '#'
      } else {
        char = '.' // input[i]
      }
      line = line + char
    }

    break
  }

  // we have seen this already, skip processing
  if (seen.has(currentPosition + ',' + direction + ',' + stepsInSameDirection))
    continue

  // add to seen
  seen.add(currentPosition + ',' + direction + ',' + stepsInSameDirection)

  // find positions we can step to and add it to the queue
  var nextPositions = [
    { direction: 'top', position: currentPosition - width },
    { direction: 'right', position: currentPosition + 1 },
    { direction: 'bottom', position: currentPosition + width },
    { direction: 'left', position: currentPosition - 1 },
  ]

  // only add next possible step to the queue if it fulfills several conditions
  for (let i = 0; i < nextPositions.length; i++) {
    var nextPosition = nextPositions[i].position
    var nextDirection = nextPositions[i].direction

    if (allVisited.indexOf(nextPosition) != -1) continue // do not go back to already visited position
    if (nextDirection != direction && stepsInSameDirection < 4) continue // cannot turn if it did not go at least 4 steps
    if (nextDirection == direction && stepsInSameDirection > 9) continue // cannot continue more than 10 steps
    if (nextPosition % width == 0 && nextDirection == 'right') continue // cannot go from right all the way to the left
    if (nextPosition % width == width - 1 && nextDirection == 'left') continue // cannot go from left all the way to the right
    if (nextPosition <= 0 || nextPosition > endPosition) continue // cannot go to the start or out of bound from start or end

    // we passed the conditions, add it to the queue

    // shallow copy visited nodes to be able to update it for one step only and not for other
    var nextAllVisited = [...allVisited]
    nextAllVisited.push(Number(nextPosition))

    // either add next step if we continue with the position or start as 1
    var nextStepsInSameDirection =
      direction == nextDirection ? stepsInSameDirection + 1 : 1

    queue.push([
      heapLoss + Number(input[nextPosition]),
      nextPosition,
      nextDirection,
      nextStepsInSameDirection,
      nextAllVisited,
    ])
  }
}
