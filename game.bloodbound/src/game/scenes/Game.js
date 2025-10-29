import Phaser, { Scene } from 'phaser'
import { initCombat, tryAttack } from '../utilits/combat.js'
import { createPlayer } from '../objects/player.js'
import { spawnEnemyRow, spawnBoss } from '../objects/enemies.js'

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
    const startY = height - 120
    this.player = createPlayer(this, startX, startY, 'hero', 0.5)
    this.enemies = this.physics.add.group()
    // простые счётчики золота/опыта — инициализируем ДО того, как коллайдеры или combat будут их использовать
    this.gold = 0
    this.xp = 0
    this.uiText = this.add.text(16, 16, 'Gold: 0  XP: 0', {
      fontFamily: 'Arial',
      fontSize: 20,
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
    this.menu_button = this.add.text(width - 80, 16, 'Menu', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#a30686ff'
    }).setInteractive()

    this.menu_button.on('pointerdown', () => {
    this.scene.start('Menu')
    this.scene.pause()

    })

    // управление
    this.joyStick = this.plugins.get('rexVirtualJoystick').add(this, {
      x: 200,
      y: this.scale.height - 80,
      radius: 60,
      base: this.add.circle(0, 0, 60, 0x888888, 0.4),
      thumb: this.add.circle(0, 0, 25, 0xffffff, 0.9),
    })

    initCombat(this)

    // Timed events: use scene.time.addEvent for reliable timers
    // spawn boss repeatedly every 1 second
    this.time.addEvent({
      delay: 1000,
      callback: () => spawnBoss(this, 'vamp', 1),
      loop: true
    })

    // spawn an enemy row repeatedly every 2 seconds
    this.time.addEvent({
      delay: 2000,
      callback: () => spawnEnemyRow(this, 'vamp', 0.5),
      loop: true
    })

    // attack loop: try to attack on a regular interval (200 ms)
    this.time.addEvent({
      delay: 200,
      callback: () => tryAttack(this),
      loop: true
    })
  }


  update() {
    const speed = 220
    const cursorKeys = this.joyStick.createCursorKeys()
    this.player.body.setVelocity(0)

    if (cursorKeys.left.isDown) this.player.body.setVelocityX(-speed)
    else if (cursorKeys.right.isDown) this.player.body.setVelocityX(speed)

    if (cursorKeys.up.isDown) this.player.body.setVelocityY(-speed)
    else if (cursorKeys.down.isDown) this.player.body.setVelocityY(speed)

  }
}