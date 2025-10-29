export function spawnEnemyRow(scene, key = 'enemy', imScale = 1) {
  // Use the passed `scene` (not `this`). Create N enemies in a row and
  // return an array of created enemy objects (may be empty).
  const w = scene.scale.width
  const y = Phaser.Math.Between(120, scene.scale.height - 120)
  const count = 8
  const gap = Math.floor(w / (count + 1))
  const enemy_count = Math.floor(Math.random() * count)

  const created = []
  for (let i = 1; i <= enemy_count; i++) {
    const x = i * gap
    // physics.add.image already creates an Arcade body
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    created.push(enemy)
  }

  return created
}

export function spawnBoss(scene, key = 'boss', imScale = 1) {
  const w = scene.scale.width
  const y = Phaser.Math.Between(120, scene.scale.height - 120)
  const count = 2
  const gap = Math.floor(w / (count + 1))
  const enemy_count = Math.floor(Math.random() * count)

  const created = []
  for (let i = 1; i <= enemy_count; i++) {
    const x = i * gap
    const enemy = scene.physics.add.image(x, y, key).setScale(imScale)
    enemy.body.setImmovable(true)
    scene.enemies.add(enemy)
    enemy.setData('isEnemy', true)
    created.push(enemy)
  }

  return created
}