import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale,Game } from 'phaser';
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 390,
    height: 844,
    parent: 'app',
    backgroundColor: '#028af8',
    scale: {

        autoCenter: Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [MainGame],
    plugins: {
        global: [{
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
        }]
    }
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
