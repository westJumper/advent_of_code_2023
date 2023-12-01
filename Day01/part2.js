const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0

reader.on('line', function (line) {
  var characters = line.length
  var firstFound = false
  var first = undefined
  var last = undefined

  for (var i = 0; i < characters; i++) {
    // processing first
    if (!firstFound) {
      first = startsWithStringNumber(line, i)
    }

    if (first === undefined && !isNaN(Number(line[i]))) {
      first = Number(line[i])
    }

    if (first !== undefined) {
      firstFound = true
    }

    // processing last
    var currentStringNumber = startsWithStringNumber(line, i)
    if (currentStringNumber !== undefined) last = currentStringNumber
    if (!isNaN(Number(line[i]))) last = Number(line[i])

    if (i + 1 == characters) {
      //console.log('first: ' + first)
      //console.log('last: ' + last)
      var both = first.toString() + last.toString()
      sum = sum + Number(both)
    }
  }
})

reader.on('close', function () {
  console.log(sum)
})

function startsWithStringNumber(line, i) {
  var result = undefined
  var current = line.substring(i, line.length)

  current.startsWith('one') ? (result = 1) : undefined
  current.startsWith('two') ? (result = 2) : undefined
  current.startsWith('three') ? (result = 3) : undefined
  current.startsWith('four') ? (result = 4) : undefined
  current.startsWith('five') ? (result = 5) : undefined
  current.startsWith('six') ? (result = 6) : undefined
  current.startsWith('seven') ? (result = 7) : undefined
  current.startsWith('eight') ? (result = 8) : undefined
  current.startsWith('nine') ? (result = 9) : undefined

  return result
}
