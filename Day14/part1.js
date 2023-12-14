const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0
var lines = []
reader.on('line', function (line) {
  switch (getLineType(line)) {
    case 'empty':
      var columns = getColumnsFromLines(lines)
      for (let i = 0; i < columns.length; i++) {
        sum = sum + calculateRockWeight(tilt(columns[i]))
      }

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

function tilt(oneline) {
  var lineLength = oneline.length
  oneline = oneline.split('')
  // this is not optimal but does the job
  for (let y = 0; y < lineLength; y++) {
    for (let i = 0; i < lineLength - 1; i++) {
      var current = oneline[i]
      var next = oneline[i + 1]
      if (current == '.' && next == 'O') {
        oneline.splice(i, 1, 'O')
        oneline.splice(i + 1, 1, '.')
      }
    }
  }

  return oneline
}

function calculateRockWeight(tilted) {
  var length = tilted.length

  var sum = 0
  for (let i = 0, j = length; i < length; i++, j--) {
    if (tilted[i] == 'O') sum = sum + j
  }

  return sum
}
