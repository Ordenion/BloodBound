import { Scene } from 'phaser'

export class Menu extends Scene {
  constructor() {
    super('Menu')
  }

  create() {
    const { width, height } = this.scale

    const title = this.add.text(0 , 0 , 'My Idle Game', {
      fontFamily: 'Arial Black',
      fontSize: 48,
      color: '#1d1515ff'
    }).setOrigin(0)
    title.setX(this.scale.width / 2 - title.width / 2)
    title.setY(100)

    const startText = this.add.text(width /2, height - 400, '▶ Start', {
      fontFamily: 'Arial',
      fontSize: 36,
      color: '#00ff00'
    }).setOrigin(0).setInteractive()

    startText.setX(this.scale.width / 2 - startText.width / 2)
    startText.setY(300)

    startText.on('pointerdown', () => {
      this.scene.start('Game')
    })
  }
}
