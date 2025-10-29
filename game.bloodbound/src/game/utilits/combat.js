


export function initCombat(scene) {
  // пул снарядов
  scene.bullets = scene.physics.add.group({
    classType: Phaser.GameObjects.Rectangle,
    maxSize: 50,
    runChildUpdate: false
  })

  // melee hitbox
  scene.meleeHitbox = scene.add.zone(scene.player.x, scene.player.y, 60, 60)
  scene.physics.add.existing(scene.meleeHitbox)
  scene.meleeHitbox.body.setEnable(false)
  scene.physics.add.overlap(scene.meleeHitbox, scene.enemies, (hitbox, enemy) => {
    damageEnemy(scene, enemy, scene.currentWeapon.dmg)
  }, null, scene)

  scene.weapons = [
    { id: 'pistol', name: 'Pistol', type: 'ranged', dmg: 6, fireRate: 300, projectileSpeed: 600 },
    { id: 'sword', name: 'Sword', type: 'melee', dmg: 12, fireRate: 700, range: 60 }
  ]
  scene.currentWeapon = scene.weapons[0]
  scene.lastFired = 0

  // коллизия пуль с врагами
  scene.physics.add.overlap(scene.bullets, scene.enemies, (bullet, enemy) => {
    damageEnemy(scene, enemy, bullet.dmg)
    bullet.destroy()
  }, null, scene)
}

export function tryAttack(scene) {
  if (scene.currentWeapon.type === 'ranged') fireProjectile(scene)
  else if (scene.currentWeapon.type === 'melee') doMelee(scene)
}

function fireProjectile(scene) {
  // направление снаряда: вверх (в Phaser отрицательное Y — вверх)
  const dirX = 0, dirY = -1
  const bullet = scene.bullets.get(scene.player.x, scene.player.y, 8, 8, 0xffff00)
  if (!bullet) return
  if (!bullet.body) scene.physics.add.existing(bullet)
  bullet.body.setAllowGravity(false)
  bullet.body.setVelocity(dirX * scene.currentWeapon.projectileSpeed, dirY * scene.currentWeapon.projectileSpeed)
  bullet.dmg = scene.currentWeapon.dmg
  scene.time.delayedCall(1000, () => bullet.destroy())
}

function doMelee(scene) {
  scene.meleeHitbox.body.setEnable(true)
  scene.meleeHitbox.x = scene.player.x + 40
  scene.meleeHitbox.y = scene.player.y
  scene.meleeHitbox.body.updateFromGameObject()
  scene.time.delayedCall(150, () => {
    scene.meleeHitbox.body.setEnable(false)
  })
}

function damageEnemy(scene, enemy, dmg) {
  if (enemy._dead) return
  enemy.hp = (enemy.hp || 10) - dmg
  if (enemy.hp <= 0) {
    enemy._dead = true
    scene.tweens.add({
      targets: enemy,
      alpha: 0,
      scale: 0.6,
      duration: 150,
      onComplete: () => enemy.destroy()
    })
    scene.gold += 5
    scene.xp += 10
    scene.uiText.setText(`Gold:${scene.gold} XP:${scene.xp}`)
  }

}
