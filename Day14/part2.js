// I have almost the same functions for east and west and for north and south but I do not want to optimize it as I probably never touch the code again

const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var lines = []
reader.on('line', function (line) {
  switch (getLineType(line)) {
    case 'empty':
      break
    case 'value':
      lines.push(line.replaceAll('\r\n', ''))
      break
    default:
      break
  }
})

reader.on('close', function () {
  var height = lines.length
  var width = lines[0].length

  var spinResults = []
  var iter = 0
  var firstAppearance = 0

  for (let i = 0; i < 1000000000; i++) {
    lines = cycle(lines, width, height)
    var weight = calculateRockWeight(lines, height)
    var res = lines.join('') + ',' + weight
    if (spinResults.includes(res)) {
      iter = i + 1
      firstAppearance = spinResults.indexOf(res) + 1
      break
    } else {
      spinResults.push(lines.join('') + ',' + weight)
    }
  }

  // I knew I have to look for cycle but did not know how to calculate value for 1 billion iterations
  // I created this equation after watching https://youtu.be/WCVOBKUNc38?t=685 (start of the explanaition time)
  console.log(
    spinResults[
      ((1000000000 - firstAppearance) % (iter - firstAppearance)) +
        firstAppearance -
        1
    ].split(',')[1]
  )
})

function cycle(lines, width, height) {
  lines = tiltNorth(lines, width, height)
  lines = tiltWest(lines)
  lines = tiltSouth(lines, width, height)
  lines = tiltEast(lines)
  return lines
}

function tiltWest(lines) {
  var result = lines.map((oneline) => {
    var lineLength = oneline.length
    //console.log(oneline)
    oneline = oneline.split('')
    // this is not optimal but does the job
    for (let y = 0; y < lineLength; y++) {
      var moved = false
      for (let i = 0; i < lineLength - 1; i++) {
        var current = oneline[i]
        var next = oneline[i + 1]
        if (current == '.' && next == 'O') {
          oneline.splice(i, 1, 'O')
          oneline.splice(i + 1, 1, '.')
          moved = true
        }
      }
      // makes it a bit faster as it does end when no more moves are there even before going through all options
      if (!moved) return oneline.join('')
    }
    //console.log(oneline)
    return oneline.join('')
  })

  return result
}

function tiltEast(lines) {
  var result = lines.map((oneline) => {
    var lineLength = oneline.length
    //console.log(oneline)
    oneline = oneline.split('')
    // this is not optimal but does the job
    for (let y = 0; y < lineLength; y++) {
      var moved = false
      for (let i = 0; i < lineLength - 1; i++) {
        var current = oneline[i]
        var next = oneline[i + 1]
        if (current == 'O' && next == '.') {
          oneline.splice(i, 1, '.')
          oneline.splice(i + 1, 1, 'O')
          moved = true
        }
      }
      // makes it a bit faster as it does end when no more moves are there even before going through all options
      if (!moved) return oneline.join('')
    }
    //console.log(oneline)
    return oneline.join('')
  })

  return result
}

function tiltNorth(allLinesInOneString, width, height) {
  allLinesInOneString = allLinesInOneString.join('').split('')
  // this is not optimal but does the job
  for (let r = 0; r < height; r++) {
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      var moved = false

      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        var currentIndex = rowIndex * width + columnIndex
        var nextIndex = rowIndex * width + columnIndex + width
        var current = allLinesInOneString[currentIndex]
        var next = allLinesInOneString[nextIndex]

        //console.log('currentIndex: ' + currentIndex)
        //console.log('nextIndex: ' + nextIndex)

        if (current == '.' && next == 'O') {
          allLinesInOneString.splice(currentIndex, 1, 'O')
          allLinesInOneString.splice(nextIndex, 1, '.')
          moved = true
        }
      }
    }
  }

  // https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
  // splits the string into array with width width, first one is for any remaining values which there should not be
  var regexpcontent = '.{1,' + width + '}'
  var regexp = new RegExp(regexpcontent, 'g')
  var result = allLinesInOneString.join('').match(regexp)

  return result
}

function tiltSouth(allLinesInOneString, width, height) {
  allLinesInOneString = allLinesInOneString.join('').split('')
  // this is not optimal but does the job
  for (let r = 0; r < height; r++) {
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      var moved = false

      for (let rowIndex = 0; rowIndex < height; rowIndex++) {
        var currentIndex = rowIndex * width + columnIndex
        var nextIndex = rowIndex * width + columnIndex + width
        var current = allLinesInOneString[currentIndex]
        var next = allLinesInOneString[nextIndex]

        if (current == 'O' && next == '.') {
          allLinesInOneString.splice(currentIndex, 1, '.')
          allLinesInOneString.splice(nextIndex, 1, 'O')
          moved = true
        }
      }
    }
  }

  var regexpcontent = '.{1,' + width + '}'
  var regexp = new RegExp(regexpcontent, 'g')
  var result = allLinesInOneString.join('').match(regexp)

  return result
}

function getLineType(line) {
  if (line.length == 0) return 'empty'
  return 'value'
}

function calculateRockWeight(lines, height) {
  var sum = 0
  var weight = height

  lines.forEach((line) => {
    var rocks = line.split('O').length - 1
    sum = sum + rocks * weight
    weight--
  })

  return sum
}
