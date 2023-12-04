const f = require('fs')
var inputFile = 'input.txt'

// 78251007 - too low
// 87449461

f.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  var currentNumberInString = ''
  var numberIsAdjescentToSymbol = false
  var sum = 0
  var lineLength = data.indexOf('\r') == -1 ? data.length : data.indexOf('\r') // handles when there is only one line without \r char
  var newdata = data.replaceAll('\r\n', '') // remove end of line characters to be able to use indexes
  var sumOfRatios = 0

  newdata.split('').forEach((char, charIndex, charArray) => {
    var isGear = isCharGear(char)
    if (!isGear) return // not *

    //console.log('gear index: ' + charIndex)
    var gearRatio = calculateGearRatio(charIndex, charArray, lineLength)
    //console.log(gearRatio)
    sumOfRatios = sumOfRatios + gearRatio

    // handle end of line number
    if (
      charIndex % lineLength == lineLength - 1 &&
      currentNumberInString !== ''
    ) {
      if (numberIsAdjescentToSymbol) sum = sum + Number(currentNumberInString)
      currentNumberInString = ''
      numberIsAdjescentToSymbol = false
    }
  })

  console.log('sum: ' + sumOfRatios)
})

function isCharGear(char) {
  if (char === '*') return true
  return false
}

function isCharNumberBinary(char) {
  if (!isNaN(char)) return '1'
  return '0'
}

function isCharNumberBool(char) {
  if (!isNaN(char)) return true
  return false
}

/**
 *use binary to determine where the number is on a position (1 = it is number, 0 = not a number)
  Line has 0 numbers adjescent if - 000.
  Line has 1 number adjescent if - 100 or 010 or 001 or 110 or 011 or 111.
  Line has 2 numbers adjescent if - 101.
 * @param {int} charIndex - Index of current character in charArray.
 * @param {[string]} charArray - Whole charArray.
 * @param {int} lineLength - Length of one line.
 * @returns 
 */
function calculateGearRatio(charIndex, charArray, lineLength) {
  var topLine
  var currentLine
  var bottomLine

  // character is at the beginning of line position - do not add left positions
  if (charIndex % lineLength == 0) {
    currentLine = '00' + isCharNumberBinary(charArray[charIndex + 1])

    topLine =
      '0' +
      isCharNumberBinary(charArray[charIndex - lineLength]) +
      isCharNumberBinary(charArray[charIndex - lineLength + 1])

    bottomLine =
      '0' +
      isCharNumberBinary(charArray[charIndex + lineLength]) +
      isCharNumberBinary(charArray[charIndex + lineLength + 1])
  } else if (
    // character is at the end of line position - do not add right positions
    charIndex % lineLength ==
    lineLength - 1
  ) {
    currentLine = isCharNumberBinary(charArray[charIndex - 1]) + '00'

    topLine =
      isCharNumberBinary(charArray[charIndex - lineLength]) +
      isCharNumberBinary(charArray[charIndex - lineLength - 1]) +
      '0'

    bottomLine =
      isCharNumberBinary(charArray[charIndex + lineLength]) +
      isCharNumberBinary(charArray[charIndex + lineLength - 1]) +
      '0'
  } else {
    // character is in the middle, add all positions
    currentLine =
      isCharNumberBinary(charArray[charIndex - 1]) +
      '0' +
      isCharNumberBinary(charArray[charIndex + 1])

    topLine =
      isCharNumberBinary(charArray[charIndex - lineLength - 1]) +
      isCharNumberBinary(charArray[charIndex - lineLength]) +
      isCharNumberBinary(charArray[charIndex - lineLength + 1])

    bottomLine =
      isCharNumberBinary(charArray[charIndex + lineLength - 1]) +
      isCharNumberBinary(charArray[charIndex + lineLength]) +
      isCharNumberBinary(charArray[charIndex + lineLength + 1])
  }

  // validate all 3 lines if together they have 2 numbers adjescent
  var adjescentsCount = 0
  //console.log('top current bottom: ' + topLine + ' ' + currentLine + ' ' + bottomLine)

  // calculate how many adjescent numbers we have (see top comment for function)
  var allLines = [topLine, currentLine, bottomLine]
  allLines.forEach((line) => {
    if (line == '101') {
      adjescentsCount++
      adjescentsCount++
    } else if (line == '000') {
    } else {
      adjescentsCount++
    }
  })

  //console.log('adjescentsCount: ' + adjescentsCount)

  if (adjescentsCount == 2) {
    var startingPositions = [
      charIndex - lineLength,
      charIndex,
      charIndex + lineLength,
    ]

    var numbers = []

    startingPositions.forEach((position) => {
      //console.log(position)
      // for top number
      var value = isCharNumberBool(charArray[position])
        ? charArray[position]
        : '|'
      var loopingLeftPosition = position
      var loopingRightPosition = position

      // loop back
      while (
        isCharNumberBool(charArray[loopingLeftPosition - 1]) &&
        loopingLeftPosition % lineLength !== 0
      ) {
        value = charArray[loopingLeftPosition - 1] + value
        loopingLeftPosition = loopingLeftPosition - 1
      }

      // loop forward
      while (
        isCharNumberBool(charArray[loopingRightPosition + 1]) &&
        loopingLeftPosition % lineLength !== 0
      ) {
        value = value + charArray[loopingRightPosition + 1]
        loopingRightPosition = loopingRightPosition + 1
      }

      //console.log(value)

      value
        .split('|')
        .filter((value) => value !== '')
        .forEach((number) => {
          numbers.push(number)
        })
    })

    //console.log('gear numbers: ' + numbers[0] + ':' + numbers[1])
    //console.log('gear sum: ' + Number(numbers[0]) * Number(numbers[1]))
    //console.log('---------------')
    return Number(numbers[0]) * Number(numbers[1])
  }
  return 0
}
