const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0

reader.on('line', function (line) {
  var minBlue = undefined
  var minGreen = undefined
  var minRed = undefined

  var games = line.split(':')[1].split(';')
  //console.log(gameId)

  games.forEach(function (game) {
    game.split(',').forEach(function (type) {
      type = type.trimStart() // remove first white space
      var number = Number(type.split(' ')[0])
      var color = type.split(' ')[1]
      //console.log(number)
      //console.log(color)

      switch (color) {
        case 'blue':
          number > minBlue || minBlue == undefined
            ? (minBlue = number)
            : (minBlue = minBlue)
          break
        case 'green':
          number > minGreen || minGreen == undefined
            ? (minGreen = number)
            : (minGreen = minGreen)
          break
        case 'red':
          number > minRed || minRed == undefined
            ? (minRed = number)
            : (minRed = minRed)
          break
        default:
          console.error(
            'You should not be here. Color parsed from one reveal are not recognized. Good luck with debugging :)'
          )
          break
      }
    })
  })

  // console.log('minBlue: ' + minBlue)
  // console.log('minGreen: ' + minGreen)
  // console.log('minRed: ' + minRed)

  //console.log('valid: ' + valid)
  sum = sum + minBlue * minGreen * minRed

  //console.log('-----------')
})

reader.on('close', function () {
  console.log(sum)
})
