const fs = require('fs').promises

const MAX_ITERATIONS = 100
const LEFT_PAD = ' '.repeat(4)
const RIGHT_PAD = ' '.repeat(Math.ceil(MAX_ITERATIONS / 3))

process('patterns.txt')
  .then(results => results.join('\n'))
  .then(console.log)

async function process(fileName) {
  const content = await fs.readFile(fileName)
  const allRows = content.toString().split('\n').map(value => [`${LEFT_PAD}${value.replace(/\./g, ' ')}${RIGHT_PAD}`])
  return allRows.map(detecTypeRecursive)
}

function detecTypeRecursive(rows) {
  if (rows.length >= MAX_ITERATIONS) {
    return 'other'
  }

  const nextRow = produceNextRow(rows.slice(-1))
  return detectType(nextRow, rows) || detecTypeRecursive(rows.concat(nextRow))
}

function produceNextRow([lastRow]) {
  return lastRow.split('').map(cell).join('')
}

function cell(value, index, lastRow) {
  const filledCount = countFilled(lastRow, index - 2) + countFilled(lastRow, index - 1) +
                      countFilled(lastRow, index + 1) + countFilled(lastRow, index + 2)
  const fillCell = (filledCount === 2) ||
                   (filledCount === 3 && value !== '#') ||
                   (filledCount === 4 && value === '#')
  return fillCell ? '#' : ' '
}

function countFilled(row, index) {
  return row[index] === '#' ? 1 : 0
}

function detectType(nextRow, rows) {
  const compareToNextRow = compare.bind(null, nextRow)
  const match = rows.find(compareToNextRow)
  return match && compareToNextRow(match)
}

function compare(row, anotherRow) {
  if (row === anotherRow) {
    return 'blinking'
  }
  if (row.trim().length === 0) {
    return 'vanishing'
  }
  if (row.trim() === anotherRow.trim()) {
    return 'gliding'
  }
}
