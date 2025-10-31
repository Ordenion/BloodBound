import { GRID_ROWS, GRID_COLS, FIELD_VERTICAL_PADDING } from './constants.js'

/**
 * Инициализация виртуального поля и сетки ячеек.
 * Результат сохраняется в scene.field
 */
export function initField(scene) {
  const gameW = scene.game.config.width
  const gameH = scene.game.config.height

  const headerH = scene.header?.displayHeight || 0
  const footerH = scene.footer?.displayHeight || 0
  const leftW = scene.walls?.leftWall?.displayWidth || 0
  const rightW = scene.walls?.rightWall?.displayWidth || 0

  const minX = leftW
  const maxX = gameW - rightW
  const minY = headerH + FIELD_VERTICAL_PADDING
  const maxY = gameH - footerH - FIELD_VERTICAL_PADDING

  const fieldWidth = Math.max(1, maxX - minX)
  const fieldHeight = Math.max(1, maxY - minY)

  const cellW = fieldWidth / GRID_COLS
  const cellH = fieldHeight / GRID_ROWS

  const cells = []
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const x = minX + c * cellW
      const y = minY + r * cellH
      cells.push({ row: r, col: c, x, y, width: cellW, height: cellH, occupied: false })
    }
  }

  scene.field = {
    bounds: { minX, maxX, minY, maxY, width: fieldWidth, height: fieldHeight },
    rows: GRID_ROWS,
    cols: GRID_COLS,
    cellW,
    cellH,
    cells,
    nextRowToSpawn: 0
  }
  return scene.field
}

export function getCellsForRow(scene, rowIndex) {
  if (!scene.field) initField(scene)
  const { rows, cols, cells } = scene.field
  const r = Math.max(0, Math.min(rows - 1, rowIndex))
  const start = r * cols
  return cells.slice(start, start + cols)
}

export function getCellCenter(cell) {
  return {
    x: cell.x + cell.width / 2,
    y: cell.y + cell.height / 2
  }
}

export function getCell(scene, row, col) {
  if (!scene.field) initField(scene)
  const { rows, cols, cells } = scene.field
  if (row < 0 || row >= rows || col < 0 || col >= cols) return null
  return cells[row * cols + col]
}

function markOccupied(cell, value = true) {
  cell.occupied = !!value
}

/**
 * Выбор свободных ячеек для врагов в указанной строке.
 * Если boss=true — требуется 2 соседние ячейки по горизонтали.
 */
export function pickFreeCellsForRow(scene, rowIndex, count = 1, boss = false) {
  const rowCells = getCellsForRow(scene, rowIndex)
  const chosen = []

  if (boss) {
    // собрать все доступные пары соседних клеток, перемешать и выбрать
    const pairs = []
    for (let c = 0; c < rowCells.length - 1; c++) {
      const a = rowCells[c]
      const b = rowCells[c + 1]
      if (!a.occupied && !b.occupied) pairs.push([a, b])
    }
    // перемешаем пары
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = pairs[i]
      pairs[i] = pairs[j]
      pairs[j] = tmp
    }
    for (let i = 0; i < pairs.length && chosen.length < count; i++) {
      const [a, b] = pairs[i]
      if (a.occupied || b.occupied) continue
      chosen.push([a, b])
      markOccupied(a)
      markOccupied(b)
    }
  } else {
    // одиночные клетки
    const shuffled = [...rowCells]
    // лёгкая перестановка для равномерности
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = tmp
    }
    for (let i = 0; i < shuffled.length && chosen.length < count; i++) {
      if (!shuffled[i].occupied) {
        chosen.push(shuffled[i])
        markOccupied(shuffled[i])
      }
    }
  }

  return chosen
}

/**
 * Возвращает индекс следующей линии (строки) для спавна сверху вниз.
 */
export function getNextSpawnRow(scene) {
  if (!scene.field) initField(scene)
  const idx = scene.field.nextRowToSpawn % scene.field.rows
  scene.field.nextRowToSpawn = (scene.field.nextRowToSpawn + 1) % scene.field.rows
  return idx
}

/**
 * Освободить ячейки (например, когда враг уничтожен).
 */
export function freeCells(cells) {
  if (!cells) return
  const list = Array.isArray(cells) ? cells : [cells]
  list.forEach(c => markOccupied(c, false))
}


