const f = require('fs')
var inputFile = 'input.txt'
var data = f.readFileSync(inputFile).toString()

var input = data.split('\r\n')

var workflows = new Map()
var sum = 0

var lineSwitch = 0
input.forEach((line) => {
  if (lineSwitch == 1) {
    lineSwitch++
  }

  if (line.length == 0) {
    lineSwitch = 1
  }

  if (lineSwitch == 0) {
    var key = line.split('{')[0]
    var rules = line
      .substring(line.indexOf('{') + 1, line.length - 1)
      .split(',')

    workflows.set(key, rules)
  }

  if (lineSwitch == 2) {
    var parts = new Map()
    line
      .substring(1, line.length - 1)
      .split(',')
      .forEach((component) => {
        var id = component.split('=')[0]
        var value = component.split('=')[1]
        parts.set(id, Number(value))
      })

    var currentWorkflow = 'in'
    var finalWorkflows = ['A', 'R']

    while (finalWorkflows.indexOf(currentWorkflow) == -1) {
      var workflowRules = workflows.get(currentWorkflow)

      var found = false
      for (let i = 0; i < workflowRules.length; i++) {
        var rule = workflowRules[i]
        if (rule.indexOf(':') != -1) {
          var ruleIndex = rule.substring(0, 1)
          var operator = rule.substring(1, 2)
          var value = Number(
            rule.substring(rule.indexOf(operator) + 1, rule.indexOf(':'))
          )
          var jumpToIfTrue = rule.split(':')[1]
          // if condition is fulfilled set current workflow to value and break the loop
          switch (operator) {
            case '>':
              if (parts.get(ruleIndex) > value) {
                currentWorkflow = jumpToIfTrue
                found = true
              }
              break
            case '<':
              if (parts.get(ruleIndex) < value) {
                currentWorkflow = jumpToIfTrue
                found = true
              }
              break
            default:
              console.log('unknown operator')
              break
          }
        } else {
          currentWorkflow = rule
        }

        if (found) break
      }
    }

    if (currentWorkflow == 'A') {
      Array.from(parts.values()).forEach((value) => {
        sum = sum + value
      })
    }
  }
})

console.log('sum: ' + sum)
