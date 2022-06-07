import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    console.log('preloading MainScene');

    this.load.image('skeleton', 'assets/sprites/skeleton.png');
  }

  create() {
    console.log('creating MainScene');

    const skeletonSprite = this.add.sprite(450, 290, 'skeleton');
    skeletonSprite.frame.height = 112; // 8px * 14 blocks
    skeletonSprite.frame.width = 64; // 8px * 8 blocks
    skeletonSprite.frame.cutHeight = 112;
    skeletonSprite.frame.cutWidth = 64;
    skeletonSprite.frame.updateUVs();
    skeletonSprite.setOrigin(0.5, 0.5);

    this.add.text(250, 250, 'Adventure Awaits!');
  }
}

export default MainScene;
