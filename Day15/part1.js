const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.replaceAll('\r\n', '').split(',')

var sum = 0

input.forEach((step) => {
  var value = 0
  step.split('').forEach((char) => {
    value = ((value + char.charCodeAt(0)) * 17) % 256
  })

  sum = sum + value
})

console.log(sum)
