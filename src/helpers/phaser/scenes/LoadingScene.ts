import Phaser from 'phaser';

class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  create() {
    this.scene.start('StartScene');
  }
}

export default LoadingScene;
