import { Scene } from 'phaser'
// Assets.
import flagImg from '../assets/flag.png'

class LoadingGame extends Scene {
  constructor () {
    super({ key: 'loadingGame' })

    // TODO: only used for dev. Remove.
    this.flagAnimationDurationMs = 4000
  }

  preload () {
    this.load.image('flag', flagImg)
  }

  create () {
    this.createFlag()
    this.createText()
  }

  createText () {
    this.loadingText = this.add
      .text(this.game.scale.width, this.game.scale.height, 'Loading Game...', {
        font: '30px',
        fill: 'white'
      })
      .setOrigin(1)
      .setPadding(0, 0, 50, 50)

    this.tweens.add({
      targets: this.loadingText,
      alpha: 0.1,
      ease: 'in',
      duration: 900,
      yoyo: true,
      loop: -1
    })
  }

  createFlag () {
    this.flag = this.add.image(
      this.game.scale.width * 0.5,
      this.game.scale.height * 0.5,
      'flag'
    )

    this.flag.setScale(0)

    this.tweens.add({
      targets: this.flag,
      scale: 20,
      ease: 'in',
      duration: this.flagAnimationDurationMs,
      onComplete: () => {
        this.fadeOutAndLoadLevel()
      }
    })
  }

  fadeOutAndLoadLevel () {
    this.tweens.add({
      targets: [this.flag, this.loadingText],
      alpha: 0,
      ease: 'power2',
      duration: 500,
      onComplete: () => {
        this.scene.start('level00')
      }
    })
  }
}

export default LoadingGame
