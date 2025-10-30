import Phaser, { Scene } from 'phaser'
import { initCombat, tryAttack } from '../utilits/combat.js'
import { createPlayer } from '../objects/player.js'
import { spawnEnemyRow, spawnBoss } from '../objects/enemies.js'
import {
  UI_FONT_SIZE,
  UI_TEXT_PADDING,
  MENU_BUTTON_OFFSET_X,
  START_Y_OFFSET,
  JOYSTICK_X,
  JOYSTICK_OFFSET_BOTTOM,
  JOYSTICK_RADIUS,
  JOYSTICK_THUMB_RADIUS,
  PLAYER_DEFAULT_SCALE,
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

  preload() {
    this.load.image('vamp', '../assets/vamp.png');
    this.load.image('hero', '../assets/hero.png');
  }

  create() {
    const { width, height } = this.scale
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height)

    // игрок
  const startX = width / 2
  const startY = height - START_Y_OFFSET
  // createPlayer now has a sensible default scale, so no need to pass it explicitly
  this.player = createPlayer(this, startX, startY, 'hero')


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
    this.scene.pause()

    })

    // управление
    this.joyStick = this.plugins.get('rexVirtualJoystick').add(this, {
      x: JOYSTICK_X,
      y: this.scale.height - JOYSTICK_OFFSET_BOTTOM,
      radius: JOYSTICK_RADIUS,
      base: this.add.circle(0, 0, JOYSTICK_RADIUS, 0x888888, 0.4),
      thumb: this.add.circle(0, 0, JOYSTICK_THUMB_RADIUS, 0xffffff, 0.9),
    })

    initCombat(this)

  // debug graphics for hitboxes (optional)
  this.debugGraphics = this.add.graphics()
  if (SHOW_HITBOX) this.debugGraphics.setDepth(200)

    // Timed events: use scene.time.addEvent for reliable timers
    // spawn boss repeatedly every 1 second
    this.time.addEvent({
      delay: SPAWN_BOSS_DELAY,
      callback: () => spawnBoss(this, 'vamp', 1),
      loop: true
    })

    // spawn an enemy row repeatedly every 2 seconds
    this.time.addEvent({
      delay: SPAWN_ENEMY_DELAY,
      callback: () => spawnEnemyRow(this, 'vamp', 0.5),
      loop: true
    })

    // attack loop: try to attack on a regular interval (200 ms)
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

    // draw debug hitboxes if enabled
    if (SHOW_HITBOX && this.debugGraphics) {
      const g = this.debugGraphics
      g.clear()
      g.lineStyle(DEBUG_HITBOX_LINEWIDTH, DEBUG_HITBOX_COLOR, 1)

      // world bounds
      try {
        const wb = this.physics.world.bounds
        g.strokeRect(wb.x, wb.y, wb.width, wb.height)
      } catch (e) {}

      // player body
      if (this.player && this.player.body) {
        const b = this.player.body
        g.strokeRect(b.x, b.y, b.width, b.height)
      }

      // enemies
      if (this.enemies) {
        this.enemies.getChildren().forEach(enemy => {
          if (enemy && enemy.body) {
            const eb = enemy.body
            g.strokeRect(eb.x, eb.y, eb.width, eb.height)
          }
        })
      }

      // bullets
      if (this.bullets) {
        this.bullets.getChildren().forEach(bullet => {
          if (bullet && bullet.body) {
            const bb = bullet.body
            g.strokeRect(bb.x, bb.y, bb.width, bb.height)
          }
        })
      }

      // melee hitbox (zone)
      if (this.meleeHitbox) {
        const hb = this.meleeHitbox
        if (hb.body) g.strokeRect(hb.body.x, hb.body.y, hb.body.width, hb.body.height)
        else if (hb.width && hb.height) g.strokeRect(hb.x - hb.width/2, hb.y - hb.height/2, hb.width, hb.height)
      }
    }

  }
}