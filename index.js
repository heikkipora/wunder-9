const fs = require('fs').promises

const MAX_ITERATIONS = 100

process('patterns.txt')
  .then(results => results.join('\n'))
  .then(console.log)

async function process(fileName) {
  const content = await fs.readFile(fileName)
  const allRows = content.toString().split('\n').map(value => value.replace(/\./g, ' '))
  return allRows.map(detectType)
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
  if (row.trim().length === 0) {
    return 'vanishing'
  }
  if (row === earlierRow) {
    return 'blinking'
  }
  if (row.trim() === earlierRow.trim()) {
    return 'gliding'
  }
}

function produceNextRow(lastRow) {
  const row = []
  for (let index = 0; index < lastRow.length; index += 1) {
    row.push(cell(index, lastRow) ? '#' : ' ')
  }
  return row.join('')
}

function cell(index, lastRow) {
  const filledCount = countHash(lastRow, index - 2) + countHash(lastRow, index - 1) + countHash(lastRow, index + 1) + countHash(lastRow, index + 2)
  if (lastRow[index] === '#') {
    return filledCount === 2 || filledCount === 4
  }
  return filledCount === 2 || filledCount === 3
}

function countHash(row, index) {
  return row[index] === '#' ? 1 : 0
}