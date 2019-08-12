import Phaser from 'phaser'
import Level00 from './level-00'

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scene: Level00
}

export { config }
