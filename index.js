const fs = require('fs').promises

main().then(console.table)

async function main() {
  const patterns = await readPatterns()
  return patterns.map(detectPattern)
}

async function readPatterns() {
  const content = await fs.readFile('patterns.txt')
  return content.toString().split('\n').map(line => `..${line}..`.split('').map(c => c === '#' ? 1 : 0))
}

const MAX_ITERATIONS = 100
const types = ['blinking', 'gliding', 'vanishing', 'other']

function detectPattern(firstRow, index) {
  const rows = [firstRow]
  let type = null
  for (let i = 0; i < MAX_ITERATIONS && !type; i++) {
    const lastRow = produceNextRow(rows[rows.length - 1])
    type = compareRows(lastRow, rows)
    rows.push(lastRow)
  }

  return {index, type: type || 'other'}
}

function compareRows(lastRow, rows) {
  let type = null
  for (let i = rows.length - 1; i >= 1 && !type; i -= 1) {
    type = compare(lastRow, rows[i])
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

function visualize(rows) {
  return rows.map(row => row.map(n => n ? '#' : '.').join('')).join('\n')
}

const PADDING = 2

function produceNextRow(pattern) {
  const row = new Array(pattern.length).fill(0)
  for (let index = PADDING; index < pattern.length - PADDING; index += 1) {
    row[index] = cell(index, pattern) ? 1 : 0
  }
  return row
}

function cell(index, pattern) {
  const filledNeighbors = pattern[index - 2] + pattern[index - 1] + pattern[index + 1] + pattern[index + 2] 
  if (pattern[index]) {
    return filledNeighbors === 2 || filledNeighbors === 4
  }
  return filledNeighbors === 2 || filledNeighbors === 3
}