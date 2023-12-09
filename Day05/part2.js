// brute force that does not work on input

const f = require('fs')
const readline = require('readline')
var inputFile = 'test.txt'

var reader = readline.createInterface({
  input: f.createReadStream(inputFile),
})

var currentArray = [] // for storing ranges that we currently have
// origin with destination order in array is kept all the time, it is sorted on the way for faster processing though
var currentRangesMapToOrigin = [] // for storing mapping origins
var currentRangesMapTo = [] // for storing mapping destinations
var mappings = [] // to store all origins and destinations for final calculation

// parse the file first
reader.on('line', function (line) {
  switch (lineType(line)) {
    case 'header':
      // skip the first header
      if (currentRangesMapToOrigin.length != 0) {
        mappings.push(currentRangesMapToOrigin, currentRangesMapTo)

        // reset parsing
        currentRangesMapToOrigin = []
        currentRangesMapTo = []
      }
      break
    case 'first':
      line
        .split(': ')[1]
        .split(' ')
        .forEach((number, index, array) => {
          if (index % 2 == 0) {
            currentArray.push(Number(array[index]))
            currentArray.push(
              Number(array[index]) + Number(array[index + 1] - 1)
            )
          }
        })

      currentArray.sort(function (a, b) {
        return a - b
      })
      break
    case 'map':
      var linesplit = line.split(' ')
      var target = Number(linesplit[0])
      var source = Number(linesplit[1])
      var range = Number(linesplit[2])

      currentRangesMapTo.push(target)
      currentRangesMapTo.push(target + range - 1)
      currentRangesMapToOrigin.push(source)
      currentRangesMapToOrigin.push(source + range - 1)

      break
    default:
      break
  }
})

reader.on('close', function () {
  // last mapping to parse
  mappings.push(currentRangesMapToOrigin, currentRangesMapTo)

  // calculate based on parsed file
  // odd is origin, even is destination
  for (let x = 0; x < mappings.length; x = x + 2) {
    var [origin, destination] = sortMappingFromLowestToHighest(
      mappings[x],
      mappings[x + 1]
    )

    currentArray = mapCurrentBasedOnMapping(origin, destination, currentArray)
  }

  console.log(Math.min(...currentArray))
})

function lineType(line) {
  if (line.startsWith('seeds:')) return 'first'
  if (line.length == 0) return 'empty'
  if (!isNaN(line[0])) return 'map'
  return 'header'
}

function sortMappingFromLowestToHighest(origin, destination) {
  var tempOriginalArray = [...origin]

  // sort original array from lower range to higher
  origin.sort(function (a, b) {
    return a - b
  })

  // sort destination based on the sorter origin mapping
  var sortedCurrentRangesMapTo = []
  origin.forEach((value) => {
    var indexInOriginal = tempOriginalArray.indexOf(value)
    sortedCurrentRangesMapTo.push(destination[indexInOriginal])
  })

  return [origin, sortedCurrentRangesMapTo]
}

/**
 *
 * Idea behind each array of numbers is that even number is beginning of range and odd number is end of range
 *
 * There are 6 different cases how the current range can map to origin
 * 1 - current is before origin
 * <==current==>
 *                <==origin==>
 *
 * 2 - current starts before origin and end inside origin
 * <==current==>
 *        <==origin==>
 *
 * 3 - current is inside origin
 *    <==current==>
 * <======origin======>
 *
 * 4 - current starts inside origin and ends after origin
 *      <==current==>
 * <==origin==>
 *
 * 5 - current is after origin
 *                <==current==>
 * <==origin==>
 *
 * 6 - current starts before origin and ends after origin
 * <======current======>
 *      <==origin==>
 *
 * Overlap of current and origin must be mapped to destination including edge values
 * Values from current that do not overlap must be checked with other origin ranges
 * If at the end there is no overlap between current and origin the range is taken over as is from current
 *
 * @param {[Number]} origin
 * @param {[Number]} destination
 * @param {[Number]} current
 * @returns array of numbers sorted from low to high
 */
function mapCurrentBasedOnMapping(origin, destination, current) {
  var nextMapping = []
  var startCurrent
  var endCurrent

  for (let i = 0; i < current.length; i = i + 2) {
    startCurrent = current[i]
    endCurrent = current[i + 1]
    var found = false

    for (let x = 0; x < origin.length; x = x + 2) {
      if (!found) {
        var startOrigin = origin[x]
        var endOrigin = origin[x + 1]
        var startDestination = destination[x]
        var endDestination = destination[x + 1]

        if (startCurrent < startOrigin && endCurrent < startOrigin) {
          // 1
          // continue
        } else if (startCurrent > endOrigin) {
          // 5
          // continue
        } else if (startCurrent >= startOrigin && endCurrent <= endOrigin) {
          // 3
          nextMapping.push(startCurrent - startOrigin + startDestination)
          nextMapping.push(endCurrent - startOrigin + startDestination)
          found = true
        } else if (startCurrent < startOrigin && endCurrent <= endOrigin) {
          // 2
          // get the value that overlap
          nextMapping.push(startOrigin + startDestination) // beginning
          nextMapping.push(endCurrent - startOrigin + startDestination) // end

          // add before overlap
          current.push(startCurrent)
          current.push(startOrigin - 1)

          found = true
        } else if (
          startCurrent <= endOrigin &&
          endCurrent >= endOrigin &&
          startCurrent >= startOrigin
        ) {
          // 4
          // get the value that overlap
          nextMapping.push(startCurrent - startOrigin + startDestination)
          nextMapping.push(endDestination)

          // add after overlap
          current.push(endOrigin + 1)
          current.push(endCurrent)
          found = true
        } else if (startCurrent <= startOrigin && endCurrent >= endOrigin) {
          // 6
          // get the value that overlap
          nextMapping.push(startCurrent + startDestination)
          nextMapping.push(endOrigin + startDestination)

          // add before overlap
          current.push(startOrigin + 1)
          current.push(endCurrent)

          // add after overlap
          current.push(endOrigin + 1)
          current.push(endCurrent)
          found = true
        } else {
          console.log('unknown')
        }
      }
    }

    // nothing is found in any origin - range is outside, we transfer the remaining current values
    if (!found) {
      nextMapping.push(startCurrent)
      nextMapping.push(endCurrent)
    }
  }

  // sort to start from lowest
  nextMapping.sort(function (a, b) {
    return a - b
  })

  return nextMapping
}
