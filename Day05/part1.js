const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var currentMapping = []
var mappingFound = []
reader.on('line', function (line) {
  switch (lineType(line)) {
    case 'empty':
      // reset all to not found for next mapping table
      mappingFound.fill(false)
      break
    case 'first':
      line
        .split(': ')[1]
        .split(' ')
        .forEach((number) => {
          currentMapping.push(Number(number))
          mappingFound.push(false)
        })
      break
    case 'map':
      var linesplit = line.split(' ')
      var target = Number(linesplit[0])
      var source = Number(linesplit[1])
      var range = Number(linesplit[2])

      currentMapping.forEach((original, index) => {
        if (
          mappingFound[index] == false &&
          source <= original &&
          source + range > original
        ) {
          currentMapping[index] = original - source + target
          mappingFound[index] = true
        }
      })
      break
    default:
      break
  }
})

reader.on('close', function () {
  // calculate final minimum
  console.log(Math.min(...currentMapping))
})

function lineType(line) {
  if (line.startsWith('seeds:')) return 'first'
  if (line.length == 0) return 'empty'
  if (!isNaN(line[0])) return 'map'
  return 'header'
}