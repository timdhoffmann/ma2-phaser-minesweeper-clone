import Phaser from 'phaser'
import LoadingGame from './scenes/loading-game'
import Level00 from './scenes/level-00'

// Configuration for the game. Not using physics.
export const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  // Loads the first scene in the array first.
  scene: [LoadingGame, Level00]
}
