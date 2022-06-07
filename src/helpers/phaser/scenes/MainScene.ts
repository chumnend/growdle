import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    console.log('preloading MainScene');
  }

  create() {
    console.log('creating MainScene');
  }
}

export default MainScene;
