import Phaser from 'phaser'

import WebFontFile from './WebFontFile'
import { Game } from '../consts/SceneKeys'
import { PressStart2P } from '../consts/Fonts'

export default class TitleScreen extends Phaser.Scene {
    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
    }

    create() {
        const title = this.add.text(400,250, 'PONG', {fontSize: 48, fontFamily: '"Press Start 2P"'})
        title.setOrigin(0.5, 0.5)

        this.add.text(400, 300, 'Press Space to Start', {fontFamily: PressStart2P}).setOrigin(.5)
        
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start(Game)
        })
    }
}