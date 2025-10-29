import Phaser, { Scene } from 'phaser'

export class Game extends Scene {
  constructor() {
    super('Game')
  }

  preload() {
  }

  create() {
    const { width, height } = this.scale

    // чтобы прямоугольники не улетали за экран
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height)

    // игрок — зелёный квадрат
    this.player = this.add.rectangle(200, 400, 32, 32, 0x00ff00)
    this.physics.add.existing(this.player)
    this.player.body.setCollideWorldBounds(true)

    // группа врагов — красные квадраты, один «ряд» по ширине
    this.enemies = this.physics.add.group()
    this.spawnEnemyRow()

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

    // простые счётчики золота/опыта
    this.gold = 0
    this.xp = 0
    this.uiText = this.add.text(16, 16, 'Gold: 0  XP: 0', {
      fontFamily: 'Arial',
      fontSize: 20,
      color: '#ffffff'
    }).setDepth(100)

    const timeline = this.add.timeline({
        at: 1000,
        run: () => {
            this.spawnBoss();

        }
    });
    timeline.play();

  }

  update() {
    const speed = 220
    const cursorKeys = this.joyStick.createCursorKeys()
    this.player.body.setVelocity(0)

    if (cursorKeys.left.isDown) this.player.body.setVelocityX(-speed)
    else if (cursorKeys.right.isDown) this.player.body.setVelocityX(speed)

    if (cursorKeys.up.isDown) this.player.body.setVelocityY(-speed)
    else if (cursorKeys.down.isDown) this.player.body.setVelocityY(speed)

    // если всех снесли — спавним новый ряд
    if (this.enemies.countActive(true) === 0) {
      this.spawnEnemyRow()
    }
  }

  spawnEnemyRow() {
    const w = this.scale.width
    const y = Phaser.Math.Between(120, this.scale.height - 120)
    const count = 8
    const gap = Math.floor(w / (count + 1))
    const enemy_count = Math.random() * count

    for (let i = 1; i <= enemy_count; i++) {
      const x = i * gap
      const enemy = this.add.rectangle(x, y, 32, 32, 0xff0000)
      this.physics.add.existing(enemy)
      enemy.body.setImmovable(true)
      this.enemies.add(enemy)
    }
  }

  spawnBoss(){
    const w = this.scale.width
    const y = Phaser.Math.Between(120, this.scale.height - 120)
    const count = 2
    const gap = Math.floor(w / (count + 1))
    const enemy_count = Math.random() * count

    for (let i = 1; i <= enemy_count; i++) {
      const x = i * gap
      const enemy = this.add.rectangle(x, y, 56, 56, 0x8B0000)
      this.physics.add.existing(enemy)
      enemy.body.setImmovable(true)
      this.enemies.add(enemy)
    }
  }
}
