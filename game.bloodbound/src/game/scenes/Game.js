import Phaser, { Scene } from 'phaser'
import { initCombat, tryAttack } from '../utilits/combat.js'
import { createPlayer } from '../objects/player.js'
import { spawnEnemyRow, spawnBoss } from '../objects/enemies.js'
import { addHeader } from '../objects/header.js'
import { addFooter } from '../objects/footer.js'
import { addWalls } from '../objects/walls.js'
import { createJoystick } from '../ui/joyStick.js'
import {
  UI_FONT_SIZE,
  UI_TEXT_PADDING,
  MENU_BUTTON_OFFSET_X,
  START_Y_OFFSET,
  PLAYER_SPEED,
  SHOW_HITBOX,
  DEBUG_HITBOX_COLOR,
  DEBUG_HITBOX_LINEWIDTH,
  SPAWN_BOSS_DELAY,
  SPAWN_ENEMY_DELAY,
  ATTACK_INTERVAL
} from '../utilits/constants.js'

export class Game extends Scene {
  constructor() {
    super('Game')
  }

  create() {
    const { width, height } = this.scale
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height)

    const bg = this.add.image(width / 2, height / 2, 'background')
    if (bg && bg.setDisplaySize) bg.setDisplaySize(width, height)
    if (bg && bg.setDepth) bg.setDepth(-100)

    this.header = addHeader(this)
    this.footer = addFooter(this)
    this.walls = addWalls(this, 24, this.header, this.footer)

    const startX = width / 2
    const startY = height - START_Y_OFFSET
    // createPlayer now has a sensible default scale, so no need to pass it explicitly
    this.player = createPlayer(this, startX, startY, 'hero')

    // запрещаем игроку проходить через границы
    this.physics.add.collider(this.player, this.header)
    this.physics.add.collider(this.player, this.footer)
    this.physics.add.collider(this.player, this.walls.leftWall)
    this.physics.add.collider(this.player, this.walls.rightWall)


    this.enemies = this.physics.add.group()


    this.gold = 0
    this.xp = 0
    this.uiText = this.add.text(UI_TEXT_PADDING, UI_TEXT_PADDING, 'Gold: 0  XP: 0', {
      fontFamily: 'Arial',
      fontSize: UI_FONT_SIZE,
      color: '#ffffff'
    }).setDepth(100)

    // столкновения игрока с врагами: враг уничтожается
    this.physics.add.collider(this.player, this.enemies, (_p, enemy) => {
    this.gold += 5
      this.xp += 5
      this.uiText.setText(`Gold: ${this.gold}  XP: ${this.xp}`)
      enemy.destroy()

    })
    // Open Menu button
    this.menu_button = this.add.text(width - MENU_BUTTON_OFFSET_X, UI_TEXT_PADDING, 'Menu', {
      fontFamily: 'Arial',
      fontSize: UI_FONT_SIZE,
      color: '#a30686ff'
    }).setInteractive()

    this.menu_button.on('pointerdown', () => {
    this.scene.start('Menu')

    })
    
    this.joyStick = createJoystick(this)
    
    initCombat(this)

  // debug graphics for hitboxes (optional)
  this.debugGraphics = this.add.graphics()
  if (SHOW_HITBOX) this.debugGraphics.setDepth(200)

    this.time.addEvent({
      delay: SPAWN_BOSS_DELAY,
      callback: () => spawnBoss(this, 'Boss', 0.4),
      loop: true
    })

    this.time.addEvent({
      delay: SPAWN_ENEMY_DELAY,
      callback: () => spawnEnemyRow(this, 'vamp', 0.5),
      loop: true
    })

    this.time.addEvent({
      delay: ATTACK_INTERVAL,
      callback: () => tryAttack(this),
      loop: true
    })
  }


  update() {
    const speed = PLAYER_SPEED
    const cursorKeys = this.joyStick.createCursorKeys()
    this.player.body.setVelocity(0)

    if (cursorKeys.left.isDown) this.player.body.setVelocityX(-speed)
    else if (cursorKeys.right.isDown) this.player.body.setVelocityX(speed)

    if (cursorKeys.up.isDown) this.player.body.setVelocityY(-speed)
    else if (cursorKeys.down.isDown) this.player.body.setVelocityY(speed)

    if (this.player && this.player.setDepth) this.player.setDepth(this.player.y)
    if (this.enemies) {
      this.enemies.getChildren().forEach(enemy => {
        if (enemy && enemy.setDepth) enemy.setDepth(enemy.y)
      })
    }

    if (SHOW_HITBOX && this.debugGraphics) {
      const g = this.debugGraphics
      g.clear()
      g.lineStyle(DEBUG_HITBOX_LINEWIDTH, DEBUG_HITBOX_COLOR, 1)

      try {
        const wb = this.physics.world.bounds
        g.strokeRect(wb.x, wb.y, wb.width, wb.height)
      } catch (e) {}

      if (this.player && this.player.body) {
        const b = this.player.body
        g.strokeRect(b.x, b.y, b.width, b.height)
      }

      if (this.enemies) {
        this.enemies.getChildren().forEach(enemy => {
          if (enemy && enemy.body) {
            const eb = enemy.body
            g.strokeRect(eb.x, eb.y, eb.width, eb.height)
          }
        })
      }

      if (this.bullets) {
        this.bullets.getChildren().forEach(bullet => {
          if (bullet && bullet.body) {
            const bb = bullet.body
            g.strokeRect(bb.x, bb.y, bb.width, bb.height)
          }
        })
      }

      if (this.meleeHitbox && this.meleeHitbox.body && this.meleeHitbox.body.enable) {
        const hb = this.meleeHitbox
        const b = hb.body
        g.strokeRect(b.x, b.y, b.width, b.height)
      }
    }

  }
}