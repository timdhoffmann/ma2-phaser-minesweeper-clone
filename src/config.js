import Phaser from 'phaser'
import LoadingGame from './scenes/loading-game'
import Level00 from './scenes/level-00'

// Configuration for the game. Not using physics.
export const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'gameContainer',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  },
  backgroundColor: 0x222222,
  // Loads the first scene in the array first.
  scene: [LoadingGame, Level00]
}
