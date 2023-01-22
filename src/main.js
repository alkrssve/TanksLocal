import Phaser from './lib/phaser.js'

import Game from './scenes/game.js'

console.dir(Phaser)

var game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: Game,
    autoCenter: true,
    scale: {
        mode: Phaser.Scale.LANDSCAPE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 800
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            },
            debug: false
        }
    }
})
