const f = require('fs')
var inputFile = 'input.txt'

// 546312 - correct answer

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

  newdata.split('').forEach((char, charIndex, charArray) => {
    var characterType = getCharacterType(char)
    switch (characterType) {
      case 'number':
        currentNumberInString = currentNumberInString + char
        if (!numberIsAdjescentToSymbol)
          numberIsAdjescentToSymbol = isNumberAdjescentToSymbol(
            charIndex,
            charArray,
            lineLength
          )
        break
      case 'dot':
        if (currentNumberInString !== '' && numberIsAdjescentToSymbol) {
          sum = sum + Number(currentNumberInString)
        }
        currentNumberInString = ''
        numberIsAdjescentToSymbol = false
        break
      case 'symbol':
        if (currentNumberInString !== '' && numberIsAdjescentToSymbol) {
          sum = sum + Number(currentNumberInString)
        }
        currentNumberInString = ''
        numberIsAdjescentToSymbol = false
        break
      default:
        console.error('unknown type: ' + char)
        break
    }

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

  console.log('sum: ' + sum)
})

function getCharacterType(char) {
  //if (char == '\r' || char == '\n') return 'lineend'
  if (!isNaN(char)) return 'number'
  if (char === '.') return 'dot'
  if (char === undefined) return 'undefined'
  if (isNaN(char) && char !== '.') return 'symbol'
  return 'unknown'
}

function isNumberAdjescentToSymbol(charIndex, charArray, lineLength) {
  // all possible adjescent positions
  var adjescentPositions = []

  // character is at the beginning of line position - do not add left positions
  if (charIndex % lineLength == 0) {
    adjescentPositions.push(charIndex + 1)
    adjescentPositions.push(charIndex - lineLength)
    adjescentPositions.push(charIndex - lineLength + 1)
    adjescentPositions.push(charIndex + lineLength)
    adjescentPositions.push(charIndex + lineLength + 1)
  } else if (
    // character is at the end of line position - do not add right positions
    charIndex % lineLength ==
    lineLength - 1
  ) {
    adjescentPositions.push(charIndex - 1)
    adjescentPositions.push(charIndex - lineLength)
    adjescentPositions.push(charIndex - lineLength - 1)
    adjescentPositions.push(charIndex + lineLength)
    adjescentPositions.push(charIndex + lineLength - 1)
  } else {
    // character is in the middle, add all positions
    adjescentPositions.push(charIndex + 1)
    adjescentPositions.push(charIndex - 1)
    adjescentPositions.push(charIndex - lineLength)
    adjescentPositions.push(charIndex - lineLength + 1)
    adjescentPositions.push(charIndex + lineLength)
    adjescentPositions.push(charIndex + lineLength + 1)
    adjescentPositions.push(charIndex - lineLength - 1)
    adjescentPositions.push(charIndex + lineLength - 1)
  }

  // if any character on adjescentPosition is symbol return true
  var adj = adjescentPositions.some((position) => {
    return getCharacterType(charArray[position]) == 'symbol'
  })
  return adj
}
