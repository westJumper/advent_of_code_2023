const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0

reader.on('line', function (line) {
  var eachChar = line.split('')
  var first = eachChar.find((char) => !isNaN(Number(char)))
  var last = eachChar.reverse().find((char) => !isNaN(Number(char)))

  var both = first.toString() + last.toString()
  sum = sum + Number(both)
})

reader.on('close', function () {
  console.log(sum)
})
