import Phaser from 'phaser'
import LoadingGame from './loading-game'
import Level00 from './level-00'

// Configuration for the game. Not using physics.
const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  scene: [LoadingGame, Level00]
}

export { config }
