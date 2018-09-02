const fs = require('fs').promises

const MAX_ITERATIONS = 100

process('patterns.txt')
  .then(results => results.join('\n'))
  .then(console.log)

async function process(fileName) {
  const content = await fs.readFile(fileName)
  const allRows = content.toString().split('\n').map(stringToNumericArray)
  return allRows.map(detectType)
}

function stringToNumericArray(line) {
  return line.split('').map(c => c === '#' ? 1 : 0)
}

function detectType(firstRow) {
  let type = null
  const rows = [firstRow]

  for (let i = 0; i < MAX_ITERATIONS && !type; i += 1) {
    const newRow = produceNextRow(rows[rows.length - 1])
    type = compareRows(newRow, rows)
    rows.push(newRow)
  }

  return type || 'other'
}

function compareRows(newRow, rows) {
  let type = null
  for (let i = rows.length - 1; i >= 1 && !type; i -= 1) {
    type = compare(newRow, rows[i])
  }
  return type
}

function compare(row, earlierRow) {
  if (row.reduce((acc, value) => acc += value, 0) === 0) {
    return 'vanishing'
  }
  if (row.find((value, index) => value !== earlierRow[index]) === undefined) {
    return 'blinking'
  }
}

function produceNextRow(lastRow) {
  const row = new Array(lastRow.length).fill(0)
  for (let index = 0; index < lastRow.length; index += 1) {
    row[index] = cell(index, lastRow) ? 1 : 0
  }
  return row
}

function cell(index, lastRow) {
  const filledCount = safeIndex(lastRow, index - 2) + safeIndex(lastRow, index - 1) + safeIndex(lastRow, index + 1) + safeIndex(lastRow, index + 2)
  if (lastRow[index]) {
    return filledCount === 2 || filledCount === 4
  }
  return filledCount === 2 || filledCount === 3
}

function safeIndex(array, index) {
  try {
    return array[index]
  } finally {
    return 0
  }
}

function visualize(rows) {
  return rows.map(row => row.map(n => n ? '#' : '.').join('')).join('\n')
}
