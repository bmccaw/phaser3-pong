import Phaser from 'phaser'

import WebFontFile from './WebFontFile'
import { GameBackground } from '../consts/SceneKeys'
import { White } from '../consts/Colors'

export default class Game extends Phaser.Scene {

    init () {
    this.paddleRightVelocity = new Phaser.Math.Vector2(0, 0)
    
    this.leftScore = 0
    this.rightScore = 0
    }

    preload()
    {
        const fonts = new WebFontFile(this.load, 'Press Start 2P')
        this.load.addFile(fonts)
    }

    create()
    {

        this.scene.run(GameBackground)
        this.scene.sendToBack(GameBackground)

        this.physics.world.setBounds(-100, 0, 1000, 500)
        this.ball = this.add.circle(400, 250, 10, White, 1)
        this.physics.add.existing(this.ball)
        this.ball.body.setBounce(1, 1)

        this.ball.body.setCollideWorldBounds(true, 1, 1)

        this.resetBall()

        this.paddleLeft = this.add.rectangle(50, 250, 30, 100, White, 1)
        this.physics.add.existing(this.paddleLeft, true)

        this.physics.add.collider(this.paddleLeft, this.ball)

        this.cursors = this.input.keyboard.createCursorKeys()

        this.paddleRight = this.add.rectangle(750, 250, 30, 100, White, 1)
        this.physics.add.existing(this.paddleRight, true)

        this.physics.add.collider(this.paddleRight, this.ball)

        const scoreStyle = {fontSize: 48, fontFamily: '"Press Start 2P"'}

        this.leftScoreLabel = this.add.text(300, 125, '0', scoreStyle).setOrigin(.5, .5)

        this.rightScoreLabel = this.add.text(500, 125, '0', scoreStyle).setOrigin(.5, .5)

    }

    update() {

        this.processPlayerInput()
        this.updateAi()
        this.checkScore()

    }

    processPlayerInput() {
        /** @type {Phaser.Physics.Arcade.Body} */
        const body = this.paddleLeft.body

        if (this.cursors.up.isDown) {
            this.paddleLeft.y -= 10
            body.updateFromGameObject()
        }
        else if (this.cursors.down.isDown) {
            this.paddleLeft.y +=10
            body.updateFromGameObject()
        }
    }

    updateAi() {
        const diff = this.ball.y - this.paddleRight.y
        if (Math.abs(diff) < 10) {
            return
        }

        const aiSpeed = 3
        if (diff < 0 ) {
            this.paddleRightVelocity.y = -aiSpeed
            if (this.paddleRightVelocity.y < -10) {
                this.paddleRightVelocity.y = -10
            }
        } else if (diff > 0) {
            this.paddleRightVelocity.y = aiSpeed
            if (this.paddleRightVelocity.y > 10) {
                this.paddleRightVelocity.y = 10
            }

        }

        this.paddleRight.y += this.paddleRightVelocity.y
        this.paddleRight.body.updateFromGameObject()
    }

    checkScore() {
        if (this.ball.x < -30) {
            //scored for left side
            this.incrementRightScore()
            this.resetBall()
        } else if ( this.ball.x > 830) {
            //scored on right side
            this.incrementLeftScore()
            this.resetBall()
        }
    }

    incrementLeftScore() {
        this.leftScore += 1
        this.leftScoreLabel.text = this.leftScore.toString()
    }

    incrementRightScore() {
        this.rightScore += 1
        this.rightScoreLabel.text = this.rightScore.toString()
    }

    resetBall() {
        this.ball.setPosition(400, 250)
        const angle = Phaser.Math.Between(0, 360)
        const vec = this.physics.velocityFromAngle(angle, 300)
        this.ball.body.setVelocity(vec.x, vec.y)
    }
}