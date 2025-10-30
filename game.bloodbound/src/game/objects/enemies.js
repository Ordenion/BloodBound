import { ENEMY_SPAWN_PADDING, ENEMY_DEFAULT_SCALE } from '../utilits/constants.js'
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
      setHitboxRect(enemy, 0.23, 0.4, true, -85)
    }
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    created.push(enemy)
  }

  return created
}