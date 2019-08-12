// import Phaser from 'phaser'

var config = {
  width: 800,
  height: 600,
  backgroundColor: 0x222222,
  scene: [Scene00, Scene01]
}

window.onload = function () {
  var game = new Phaser.Game(config)
}
