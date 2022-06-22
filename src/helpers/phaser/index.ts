import Phaser from 'phaser';

import LoadingScene from './scenes/LoadingScene';
import StartScene from './scenes/StartScene';
import MainScene from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'phaser-container',
  backgroundColor: '#282c34',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [LoadingScene, StartScene, MainScene],
};

export default new Phaser.Game(config);
