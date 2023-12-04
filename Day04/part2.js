const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var cards = {}
var index = 1

reader.on('line', function (line) {
  // increase current card for the original card (copies are already calculated from previous cards)
  cards[index] = !isNaN(cards[index]) ? cards[index] + 1 : 1

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

  var numberOfWinningInCurrent = winningNumbers.filter((element) =>
    myNumbers.includes(element)
  ).length

  // repeat for each ticket we currently have
  for (let y = 0; y < cards[index]; y++) {
    // repeat by number of winning tickets
    for (let i = 0; i < numberOfWinningInCurrent; i++) {
      var id = index + i + 1
      cards[id] = !isNaN(cards[id]) ? cards[id] + 1 : 1
    }
  }

  index++
})

reader.on('close', function () {
  console.log(
    Object.values(cards).reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    })
  )
})
