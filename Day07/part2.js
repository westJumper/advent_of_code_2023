const f = require('fs')
const readline = require('readline')
var inputFile = 'input.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

// for evaluating hands in the same bucket based on indexOf
var cardsStrength = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
]

// buckets for hands based on rank
// 1 is weakest
// 7 is strongest
var hands = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
}

/**
   * 
   * Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456
   */

reader.on('line', function (line) {
  var hand = line.substring(0, 5)
  var score = Number(line.split(' ')[1])

  // put each hand into a bucket based on above rules
  hands[rank(numberOfCards(hand))].push({ hand: hand, score: score })
})

reader.on('close', function () {
  // remove buckets with no hand
  var order = Object.values(hands).filter((array) => {
    return array.length > 0
  })

  // for calculation
  var total = 0
  var rankCounter = 1

  // calculate total
  order.forEach((same) => {
    var currentScore = 0

    // for only one hand in a bucket we do not need to sort
    if (same.length == 1) {
      currentScore = Number(same[0].score)
      total = total + currentScore * rankCounter
      rankCounter++
    } else {
      // sort hands inside one bucket based on hands

      // get keys only
      var keysForSort = []
      same.forEach((object) => {
        keysForSort.push(object.hand)
      })

      // sort keys based on cardsStrength dictionary above and indexOf each card (higher wins)
      var sortedKeys = keysForSort.sort((a, b) => {
        for (let i = 0; i < 5; i++) {
          var aStrength = cardsStrength.indexOf(a.split('')[i])
          var bStrength = cardsStrength.indexOf(b.split('')[i])
          if (aStrength == bStrength) {
          } else {
            return aStrength - bStrength
          }
        }
      })

      // find score for each sorted key and add to total
      sortedKeys.forEach((sortedKey) => {
        currentScore = Number(
          same.find((object) => {
            return object.hand == sortedKey
          }).score
        )
        total = total + currentScore * rankCounter
        rankCounter++
      })
    }
  })
  console.log(total)
})

function numberOfCards(input) {
  var inputArray = input.split('')

  var result = {}

  inputArray.forEach((letter, index, array) => {
    result[letter] = result[letter] ? result[letter] + 1 : 1
  })

  var scoring = Object.values(result)

  // sort high to low
  scoring.sort(function (a, b) {
    return b - a
  })

  // update results to calculate jokers
  // only if we have any joker and number of jokers is not 5 as then we do not need to recalculate
  var numberOfJokers = result['J'] == 'undefined' ? 0 : result['J']
  if (numberOfJokers > 0 && numberOfJokers != 5) {
    // remove joker and add it to larger card

    // remove joker card from the mix
    scoring.splice(scoring.indexOf(numberOfJokers), 1)

    // add joker card to the larger card
    scoring[0] = scoring[0] + numberOfJokers
  }

  return scoring
}

function rank(sameCardsCounts) {
  var toEvaluate = sameCardsCounts.join('')

  switch (toEvaluate) {
    case '5':
      return 7
      break
    case '41':
      return 6
      break
    case '32':
      return 5
      break
    case '311':
      return 4
      break
    case '221':
      return 3
      break
    case '2111':
      return 2
      break
    case '11111':
      return 1
      break
    default:
      return 'unknown'
      break
  }
}
