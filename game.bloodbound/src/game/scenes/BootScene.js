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
    this.load.image('menuBg', '../assets/floor.png')
    this.load.image('background', '../assets/floor.png')
    this.load.image('fCircle', '../assets/first_circle.png')
    this.load.image('sCircle', '../assets/second_circle.png')
  }

  create() {
    // после загрузки — сразу в меню
    this.scene.start('Menu')
  }
}
