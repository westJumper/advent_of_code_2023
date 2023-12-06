// screw parsing input, put it in as variables
var run = 'input2' // ['test1', 'test2', 'input1', 'input2']
var time
var distance

if (run == 'test1') {
  time = [7, 15, 30]
  distance = [9, 40, 200]
} else if (run == 'test2') {
  time = [71530]
  distance = [940200]
} else if (run == 'input1') {
  time = [38, 67, 76, 73]
  distance = [234, 1027, 1157, 1236]
} else if (run == 'input2') {
  time = [38677673]
  distance = [234102711571236]
}

var result = 1
time.forEach((placeholder, index) => {
  var currentResult = 0
  var currentTime = time[index]
  var currentDistance = distance[index]

  for (let i = 0; i < currentTime; i++) {
    var calculation = i * (currentTime - i)
    if (calculation > currentDistance) currentResult++
  }

  result = result * currentResult
})

console.log('result: ' + result)
