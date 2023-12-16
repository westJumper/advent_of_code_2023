const { count } = require('console')
const f = require('fs')
var inputFile = 'test.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.split('\r\n')

input.forEach((line) => {
  console.log(line)
})
