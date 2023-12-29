const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

// set limits for input.txt (puzzle) or test.txt (sample from aoc)
const minX = inputFile == 'test.txt' ? 7 : 200000000000000
const maxX = inputFile == 'test.txt' ? 27 : 400000000000000
const minY = minX
const maxY = maxX

var input = data.split('\r\n')

// get all lines into lines array with x1, y1, x2, y2 coordinations
var lines = []
input.forEach((inputLine) => {
  // x1, y1, x2, y2
  var [x1, y1, z1] = inputLine
    .split('@')[0]
    .split(',')
    .map((val) => Number(val))
  var [xv, yv, zv] = inputLine
    .split('@')[1]
    .split(',')
    .map((val) => Number(val))

  // we know x1, y1 from input
  var line = [x1, y1]

  // we have to calculate x2, y2 (it is equal to minimum steps to be taken to get above or below min or max values for both x or y coordinates)
  // these are only possible values, we have to figure out how many steps it took to get to that value below/above minimum/maximum and which ever is the first we calculate the other coordinate
  var x2Possible =
    xv >= 0 ? maxX + ((maxX - x1) % xv) : minX - ((x1 - minX) % Math.abs(xv))
  var y2Possible =
    yv >= 0 ? maxY + ((maxY - y1) % yv) : minY - ((y1 - minY) % Math.abs(yv))

  var x2Steps = Math.abs(x1 - x2Possible) / Math.abs(xv)
  var y2Steps = Math.abs(y1 - y2Possible) / Math.abs(yv)

  // depending on which is reached first we then know minimum steps and can calculate other coordinate for those steps to get the point coordinate
  if (x2Steps <= y2Steps) {
    line.push(x2Possible)
    line.push(y1 + x2Steps * yv)
  } else {
    line.push(x1 + y2Steps * xv)
    line.push(y2Possible)
  }

  // we have complete line
  lines.push(line)
})

// get intersection for each combination of two lines
var numberOfIntersections = 0
for (let i = 0; i < lines.length - 1; i++) {
  for (let x = i + 1; x < lines.length; x++) {
    var intersectCoordination = intersect(
      lines[i][0],
      lines[i][1],
      lines[i][2],
      lines[i][3],
      lines[x][0],
      lines[x][1],
      lines[x][2],
      lines[x][3]
    )

    // only if there is an intersection within min and max coordinates
    if (
      intersectCoordination != false &&
      intersectCoordination.x >= minX &&
      intersectCoordination.x <= maxX &&
      intersectCoordination.y >= minY &&
      intersectCoordination.y <= maxY
    ) {
      numberOfIntersections++
    }
  }
}

console.log('intersections: ' + numberOfIntersections)

// # Thank you Paul
// line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
// Determine the intersection point of two line segments
// Return FALSE if the lines don't intersect
function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return { x, y }
}
