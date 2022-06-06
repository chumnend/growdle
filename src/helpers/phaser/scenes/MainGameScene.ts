import Phaser from 'phaser';

class MainGameScene extends Phaser.Scene {
  constructor() {
    super('MainGameScene');
  }

  preload() {
    console.log('preloading MainGameScene');
  }

  create() {
    console.log('creating MainGameScene');
  }
}

export default MainGameScene;
