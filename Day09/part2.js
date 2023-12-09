const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0

reader.on('line', function (line) {
  var current = line.split(' ').map((str) => Number(str))
  var allZeros = false
  var next = [] // placeholder to store next array
  var allHistoryLines = []

  // get all arrays
  while (!allZeros) {
    allHistoryLines.push(current)
    next = []

    current.forEach((value, index) => {
      if (index < current.length - 1) {
        next.push(current[index + 1] - value)
      }
    })

    // to end the while loop when all values are 0
    allZeros = next.every((value) => {
      return value == 0
    })

    current = [...next] // fill current with next at the end
  }

  allHistoryLines.reverse() // reverse to make it easier for loop and start from bottom up
  var lastIndex = 0
  allHistoryLines.forEach((values) => {
    var last = values[0]
    lastIndex = last - lastIndex
  })

  sum = sum + lastIndex
})

reader.on('close', function () {
  console.log('sum: ' + sum)
})
