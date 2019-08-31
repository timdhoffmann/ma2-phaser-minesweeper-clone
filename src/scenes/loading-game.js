import { Scene } from 'phaser'
import WebFont from 'webfontloader'

// Assets.
import flagImg from '../assets/flag.png'

export default class LoadingGame extends Scene {
  constructor () {
    super({ key: 'loadingGame' })

    // TODO: change back to 4000.
    this._titleDisplayDurationMs = 3000
  }

  // #region Phaser Callback Methods.

  preload () {
    this.load.image('flag', flagImg)
  }

  create () {
    this.createLoadingIndicator()

    WebFont.load({
      google: {
        families: ['Bungee Inline', 'Bevan']
      },
      // Creates the title and animation after fonts are loaded.
      active: this.createTitleImage()
    })
  }

  // #endregion

  // #region Create Methods

  createLoadingIndicator () {
    // Creates the text.
    this._loadingText = this.add
      .text(
        this.game.scale.width * 0.5,
        this.game.scale.height * 0.5 - 40,
        'Loading Game...',
        {
          font: '30px',
          fill: 'white'
        }
      )
      .setOrigin(0.5, 0)

    // Adds an animation.
    this.tweens.add({
      targets: this._loadingText,
      alpha: 0.1,
      ease: 'in',
      duration: 900,
      yoyo: true,
      loop: -1
    })
  }

  createTitleImage () {
    // Creates the image.
    this._flag = this.add
      .image(
        this.game.scale.width * 0.5,
        this.game.scale.height * 0.5 - 60,
        'flag'
      )
      .setOrigin(0.5, 1)
      .setScale(0.25)
      .setAlpha(0.25)

    this.tweens.add({
      targets: this._flag,
      ease: 'in',
      alpha: 1,
      duration: this._titleDisplayDurationMs,
      onComplete: () => {
        this.fadeOutAndLoadLevel()
      }
    })
  }

  // #endregion

  // Fades out displayed objects and loads the first level.
  fadeOutAndLoadLevel () {
    this.tweens.add({
      targets: [this._flag, this._loadingText],
      alpha: 0,
      ease: 'power2',
      duration: 1000,
      onComplete: () => {
        this.scene.start('Level00')
      }
    })
  }
}
