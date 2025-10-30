import { ENEMY_SPAWN_PADDING, ENEMY_DEFAULT_SCALE } from '../utilits/constants.js'
import { initField, getNextSpawnRow, pickFreeCellsForRow, getCellCenter, freeCells, getCell } from '../utilits/field.js'
import { tweenMoveTo, tweenSpawnAppear } from '../utilits/animations.js'
import { setHitboxRect } from '../utilits/hitbox.js'

export function spawnEnemyRow(scene, key = 'enemy', imScale = ENEMY_DEFAULT_SCALE) {

  const w = scene.scale.width
  const y = Phaser.Math.Between(ENEMY_SPAWN_PADDING, scene.scale.height - ENEMY_SPAWN_PADDING)
  const count = 8
  const gap = Math.floor(w / (count + 1))
  const enemy_count = Math.floor(Math.random() * count)

  const created = []
    for (let i = 1; i <= enemy_count; i++) {
    const x = i * gap
    // physics.add.image already creates an Arcade body
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    // after scaling, set the physics body size to match display size and center it
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 0.5, 0.8, true, 0)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    created.push(enemy)
  }

  return created
}

export function spawnBoss(scene, key = 'boss', imScale = ENEMY_DEFAULT_SCALE) {
  const w = scene.scale.width
  const y = Phaser.Math.Between(ENEMY_SPAWN_PADDING, scene.scale.height - ENEMY_SPAWN_PADDING)
  const count = 2
  const gap = Math.floor(w / (count + 1))
  const enemy_count = Math.floor(Math.random() * count)

  const created = []
  console.log(`[spawnBoss] creating ${enemy_count} bosses (key=${key})`)
  for (let i = 1; i <= enemy_count; i++) {
    const x = i * gap
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 1.3, 2.4, true, 95)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    created.push(enemy)
  }

  return created
}

// --- Grid-based spawns ---

export function spawnEnemiesOnNextRow(scene, key = 'enemy', imScale = ENEMY_DEFAULT_SCALE, maxPerRow = 3) {
  if (!scene.field) initField(scene)
  const row = getNextSpawnRow(scene)
  const cells = pickFreeCellsForRow(scene, row, maxPerRow, false)
  const created = []
  for (const cell of cells) {
    const { x, y } = getCellCenter(cell)
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 0.5, 0.8, true, 0)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    // привязка клетки для освобождения при смерти
    enemy._gridCells = [cell]
    enemy.once('destroy', () => freeCells(enemy._gridCells))
    created.push(enemy)
  }
  return created
}

export function spawnBossOnNextRow(scene, key = 'boss', imScale = ENEMY_DEFAULT_SCALE, maxPerRow = 1) {
  if (!scene.field) initField(scene)
  const row = getNextSpawnRow(scene)
  const pairs = pickFreeCellsForRow(scene, row, maxPerRow, true)
  const created = []
  for (const pair of pairs) {
    const a = pair[0]
    const b = pair[1]
    const center = { x: (getCellCenter(a).x + getCellCenter(b).x) / 2, y: getCellCenter(a).y }
    const enemy = scene.physics.add.image(center.x, center.y, key).setScale(imScale)
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 1.3, 2.4, true, 95)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    enemy._gridCells = pair
    enemy.once('destroy', () => freeCells(enemy._gridCells))
    created.push(enemy)
  }
  return created
}

// Спавн на верхнем ряду (первая линия)
export function spawnEnemiesOnTopRow(scene, key = 'enemy', imScale = ENEMY_DEFAULT_SCALE, maxPerRow = 3) {
  if (!scene.field) initField(scene)
  const cells = pickFreeCellsForRow(scene, 0, maxPerRow, false)
  const created = []
  for (const cell of cells) {
    const { x, y } = getCellCenter(cell)
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 0.5, 0.8, true, 0)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    enemy._gridCells = [cell]
    enemy.once('destroy', () => freeCells(enemy._gridCells))
    tweenSpawnAppear(scene, enemy)
    created.push(enemy)
  }
  return created
}

export function spawnBossOnTopRow(scene, key = 'boss', imScale = ENEMY_DEFAULT_SCALE, maxPerRow = 1) {
  if (!scene.field) initField(scene)
  const pairs = pickFreeCellsForRow(scene, 0, maxPerRow, true)
  const created = []
  for (const pair of pairs) {
    const a = pair[0]
    const b = pair[1]
    const center = { x: (getCellCenter(a).x + getCellCenter(b).x) / 2, y: getCellCenter(a).y }
    const enemy = scene.physics.add.image(center.x, center.y, key).setScale(imScale)
    if (enemy.body && enemy.displayWidth && enemy.displayHeight && enemy.body.setSize) {
      setHitboxRect(enemy, 1.3, 2.4, true, 95)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    enemy._gridCells = pair
    enemy.once('destroy', () => freeCells(enemy._gridCells))
    tweenSpawnAppear(scene, enemy)
    created.push(enemy)
  }
  return created
}

// Продвинуть все занятые ряды на одну строку к игроку (вниз), чтобы освободить верхнюю линию
export function advanceEnemiesRows(scene) {
  if (!scene.field) initField(scene)
  const rows = scene.field.rows
  const cols = scene.field.cols

  // Соберём врагов по строкам
  const enemiesByRow = Array.from({ length: rows }, () => [])
  scene.enemies.getChildren().forEach(e => {
    if (!e || !e._gridCells || e._gridCells.length === 0) return
    const cell = e._gridCells[0]
    if (typeof cell?.row === 'number') {
      const r = Math.max(0, Math.min(rows - 1, cell.row))
      enemiesByRow[r].push(e)
    }
  })

  // Двигаем снизу вверх, чтобы не конфликтовать при занятии ячеек
  for (let r = rows - 2; r >= 0; r--) {
    const list = enemiesByRow[r]
    for (const enemy of list) {
      const curCells = enemy._gridCells
      if (!curCells || curCells.length === 0) continue
      // одиночный враг
      if (curCells.length === 1) {
        const cur = curCells[0]
        const next = getCell(scene, cur.row + 1, cur.col)
        if (next && !next.occupied) {
          // освободить старую, занять новую
          freeCells(cur)
          next.occupied = true
          enemy._gridCells = [next]
          const { x, y } = getCellCenter(next)
          tweenMoveTo(scene, enemy, x, y)
        }
      } else if (curCells.length === 2) {
        // босс: пара соседних клеток
        const a = curCells[0]
        const b = curCells[1]
        const nextA = getCell(scene, a.row + 1, a.col)
        const nextB = getCell(scene, b.row + 1, b.col)
        if (nextA && nextB && !nextA.occupied && !nextB.occupied) {
          freeCells([a, b])
          nextA.occupied = true
          nextB.occupied = true
          enemy._gridCells = [nextA, nextB]
          const center = { x: (getCellCenter(nextA).x + getCellCenter(nextB).x) / 2, y: getCellCenter(nextA).y }
          tweenMoveTo(scene, enemy, center.x, center.y)
        }
      }
    }
  }
}