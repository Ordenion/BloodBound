import { Scene } from 'phaser'

export class BootScene extends Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // Базовые ассеты, которые нужны в Menu и Game
    this.load.image('hero', '../assets/hero.png')
    this.load.image('vamp', '../assets/vamp.png')
    this.load.image('Boss', '../assets/yebak.png')
    this.load.image('menuBg', '../assets/Menubg.png')
    this.load.image('menuBg2', '../assets/Menubg2.png')
    this.load.image('background', '../assets/floor.png')
    this.load.image('fCircle', '../assets/first_circle.png')
    this.load.image('sCircle', '../assets/second_circle.png')
    this.load.image('footer', '../assets/footer.png')
    this.load.image('gameName', '../assets/gmae_name.png')
  }

  create() {
    this.scene.start('Menu')
  }
}
