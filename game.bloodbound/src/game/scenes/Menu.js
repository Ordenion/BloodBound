import { Scene } from 'phaser'
import { tweenFadeIn } from '../utilits/animations.js'

export class Menu extends Scene {
  constructor() {
    super('Menu')
  }

  create() {
    const { width, height } = this.scale

    const bg = this.add.image(width/2, height/2, 'menuBg2')
    bg.setDisplaySize(width, height)
    bg.setDepth(-100)

    const titleImg = this.add.image(width / 2, 100, 'gameName').setOrigin(0.5, 0)
    titleImg.setScale(0.3)
    tweenFadeIn(this, titleImg, { duration: 500, delay: 50 })

    const startText = this.add.text(width /2, height - 100, 'Start', {
      fontFamily: 'Arial',
      fontSize: 36,
      color: '#00ff00'
    }).setOrigin(0).setInteractive()
    tweenFadeIn(this, startText, { duration: 1000, delay: 100 })

    startText.setX(this.scale.width / 2 - startText.width / 2)
    startText.setY(300)

    startText.on('pointerdown', () => {
      this.scene.start('Game')
    })
  }
}
