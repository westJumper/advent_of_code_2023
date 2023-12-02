const { throws } = require('assert')
const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var maxBlue = 14
var maxGreen = 13
var maxRed = 12
var sum = 0

reader.on('line', function (line) {
  var gameId = Number(line.split(':')[0].split(' ')[1])

  var games = line.split(':')[1].split(';')
  //console.log(gameId)

  var valid = false
  valid = games.every(function (game) {
    return game.split(',').every(function (type) {
      type = type.trimStart() // remove first white space
      var number = Number(type.split(' ')[0])
      var color = type.split(' ')[1]
      //console.log(number)
      //console.log(color)

      switch (color) {
        case 'blue':
          return number <= maxBlue
          break
        case 'green':
          return number <= maxGreen
          break
        case 'red':
          return number <= maxRed
          break
        default:
          console.error(
            'You should not be here. Color parsed from one reveal are not recognized. Good luck with debugging :)'
          )
          break
      }
    })
  })

  //console.log('valid: ' + valid)
  if (valid) sum = sum + gameId

  //console.log('-----------')
})

reader.on('close', function () {
  console.log(sum)
})
