import Phaser from 'phaser';

class LoadingScene extends Phaser.Scene {
  constructor() {
    super('LoadingScene');
  }

  preload() {
    console.log('preloading LoadingScene');
  }

  create() {
    console.log('creating LoadingScene');

    this.scene.start('StartScene');
  }
}

export default LoadingScene;
