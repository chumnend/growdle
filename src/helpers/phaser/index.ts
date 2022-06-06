import Phaser from 'phaser';

import LoadingScene from './scenes/LoadingScene';
import StartScene from './scenes/StartScene';
import MainGameScene from './scenes/MainGameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [LoadingScene, StartScene, MainGameScene],
};

export default new Phaser.Game(config);
