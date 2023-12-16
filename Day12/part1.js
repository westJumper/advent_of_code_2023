const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.split('\r\n')

var total = 0

/**
 * I find this recursive function the most difficult one I have ever written and that was with the help of https://www.youtube.com/watch?v=g3Ms5e7Jdqo
 * @param {string} cfg - combination to check, for example '???.###'
 * @param {*} nums - how many broken springs we have separated by working spring/s, for example [1, 1, 3]
 * @returns - number of possible combinations for nums in cfg
 */
function count(cfg, nums) {
  // no more space and no more broken springs - valid combination
  if (cfg == '' && nums.length == 0) return 1

  // no more space and expected broken springs - invalid combination
  if (cfg == '' && nums.length != 0) return 0

  // space has broken spring but list of broken springs is empty - invalid combination
  if (cfg.includes('#') && nums.length == 0) return 0

  // no more broken springs in space and expected broken springs is empty - valid combination
  if (!cfg.includes('#') && nums.length == 0) return 1

  // to store the result
  var result = 0

  // if the first position of space is working spring or unknown we can continue checking combination without it as we can replace ? with . and it would not change anything for us
  if (cfg[0] == '.' || cfg[0] == '?') {
    // this will not break the cycle, it will count possible combinations for all alternatives of current combinations
    result = result + count(cfg.substring(1), nums)
  }

  // if the first position of space is broken spring or unknown
  if (cfg[0] == '#' || cfg[0] == '?') {
    // we have enough space to fit all expected broken springs and remaining space left does not include working spring which would invalidated the condition (in other words if currently expected broken springs would fit into the remaining space)
    // next number of broken springs in a row would fit into remaining space (remaining space cannot have working spring as it would invalidate the condition)
    if (
      nums[0] <= cfg.length && // we have enough space to fit the broken springs
      !cfg.substring(0, nums[0]).includes('.') && // we can fit whole next section of broken springs as the next section does not include working spring but only either broken or unknown which we can change to broken
      (nums[0] == cfg.length || // number of broken springs is equal to number of left space (we already checked there is no working spring) or
        cfg.split('')[nums[0]] != '#') // next position is not broken spring as we need either end or working spring to separate the broken springs
    ) {
      result = result + count(cfg.substring(nums[0] + 1), nums.slice(1))
    }
  }

  return result
}

input.forEach((line) => {
  var [cfg, nums] = line.split(' ')
  nums = nums.split(',').map(Number)
  total = total + count(cfg, nums)
})

console.log('combinations: ' + total)
