const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0
var lines = []
reader.on('line', function (line) {
  switch (getLineType(line)) {
    case 'empty':
      var columns = getColumnsFromLines(lines)

      for (let i = 1; i < lines.length; i++) {
        if (checkReflection(lines, i)) {
          sum = sum + 100 * i
        }
      }

      for (let i = 1; i < columns.length; i++) {
        if (checkReflection(columns, i)) {
          sum = sum + i
        }
      }

      lines = []
      break
    case 'value':
      lines.push(line.replaceAll('\r\n', ''))
      break
    default:
      break
  }
})

reader.on('close', function () {
  console.log(sum)
})

function getLineType(line) {
  if (line.length == 0) return 'empty'
  return 'value'
}

// transposing lines into columns
function getColumnsFromLines(lines) {
  var numberOfColumns = lines[0].split('').length
  var columns = Array(numberOfColumns).fill('')
  for (let i = 0; i < lines.length; i++) {
    lines[i].split('').forEach((char, index) => {
      columns[index] = columns[index] + char
    })
  }

  return columns
}

function checkReflection(pattern, startingRow) {
  // going horizontally (columns are transposed as well to be able to run horizontally)
  // starting at the top going one by one until reaching the end
  // starting row gives a position where to start on index from top
  // for loop goes always top up and bottom down
  // if all are ok and we reached the end we know the starting row is the middle of reflection
  for (
    let t = startingRow - 1, b = startingRow;
    t >= 0 && b < pattern.length;
    t--, b++
  ) {
    if (pattern[t] !== pattern[b]) return false
  }
  return true
}
