import { Scene } from 'phaser'

export class BootScene extends Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    // тут можно грузить ассеты, если будут
    this.load.setPath('assets')
  }

  create() {
    // когда загрузка готова — переход в меню
    this.scene.start('MenuScene')
  }
}
