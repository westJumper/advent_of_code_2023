const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var sum = 0

reader.on('line', function (line) {
  var winningNumbers = line
    .split(':')[1]
    .split('|')[0]
    .split(' ')
    .filter((value) => value != '')
  var myNumbers = line
    .split(':')[1]
    .split('|')[1]
    .split(' ')
    .filter((value) => value != '')

  const intersection = winningNumbers.filter((element) =>
    myNumbers.includes(element)
  )
  //console.log(intersection)

  var pointsForCard = 0
  intersection.forEach((value, index) => {
    if (index == 0) {
      pointsForCard = 1
      return
    }
    pointsForCard = pointsForCard * 2
  })

  sum = sum + pointsForCard

  //console.log(pointsForCard)
})

reader.on('close', function () {
  console.log(sum)
})
