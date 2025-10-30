
import { BULLET_MAX_SIZE, PISTOL, SWORD, SWORD as SWORD_CONST, DAMAGE_TWEEN_SCALE, BULLET_LIFE_MS } from './constants.js'

export function initCombat(scene) {
  // пул снарядов
  scene.bullets = scene.physics.add.group({
    classType: Phaser.GameObjects.Rectangle,
    maxSize: BULLET_MAX_SIZE,
    runChildUpdate: false
  })

  // melee hitbox (use sword range)
  scene.meleeHitbox = scene.add.zone(scene.player.x, scene.player.y, SWORD.range, SWORD.range)
  scene.physics.add.existing(scene.meleeHitbox)
  scene.meleeHitbox.body.setEnable(false)
  scene.physics.add.overlap(scene.meleeHitbox, scene.enemies, (hitbox, enemy) => {
    damageEnemy(scene, enemy, scene.currentWeapon.dmg)
  }, null, scene)

  // weapons are defined from constants so values are centralized
  scene.weapons = [
    { ...PISTOL },
    { ...SWORD }
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
  scene.time.delayedCall(BULLET_LIFE_MS, () => bullet.destroy())
}

function doMelee(scene) {
  scene.meleeHitbox.body.setEnable(true)
  // use offsets provided by the player object (set up in createPlayer)
  const offsetX = (scene.player && scene.player.meleeOffsetX) ? scene.player.meleeOffsetX : 40
  const offsetY = (scene.player && scene.player.meleeOffsetY) ? scene.player.meleeOffsetY : 0
  scene.meleeHitbox.x = scene.player.x + offsetX
  scene.meleeHitbox.y = scene.player.y + offsetY
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
      scale: DAMAGE_TWEEN_SCALE,
      duration: 150,
      onComplete: () => enemy.destroy()
    })
    scene.gold += Math.floor(Math.random() * 5)
    scene.xp += 5
    scene.uiText.setText(`Gold:${scene.gold} XP:${scene.xp}`)
  }

}
