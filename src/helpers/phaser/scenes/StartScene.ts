import Phaser from 'phaser';

class StartScene extends Phaser.Scene {
  private screenCenterX = 0;
  private screenCenterY = 0;

  constructor() {
    super('StartScene');
  }

  async preload() {
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.load.image('forest-back', './assets/backgrounds/parallax-forest-back-trees.png');
    this.load.image('forest-lights', './assets/backgrounds/parallax-forest-lights.png');
    this.load.image('forest-middle', './assets/backgrounds/parallax-forest-middle-trees.png');
    this.load.image('forest-front', './assets/backgrounds/parallax-forest-front-trees.png');
  }

  create() {
    // background
    const bgGroup = this.add.group();
    const bg1 = bgGroup.create(this.screenCenterX, this.screenCenterY, 'forest-back');
    bgGroup.create(this.screenCenterX, this.screenCenterY, 'forest-lights');
    bgGroup.create(this.screenCenterX, this.screenCenterY, 'forest-middle');
    bgGroup.create(this.screenCenterX, this.screenCenterY, 'forest-front');

    const scaleX = this.cameras.main.width / bg1.width;
    const scaleY = this.cameras.main.height / bg1.height;
    const scale = Math.max(scaleX, scaleY);
    bgGroup.scaleXY(scale);

    // title
    this.add
      .text(this.screenCenterX, this.screenCenterY - 200, 'Growdle: A Clicker Game', {
        fontFamily: 'bebas',
        fontSize: '65px',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#333', 2, false, true);

    // new game button
    const newGameButton = this.add
      .text(this.screenCenterX - 100, this.screenCenterY, 'New Game', {
        fontFamily: 'bebas',
        fontSize: '20px',
        color: '#ebede9',
      })
      .setPadding(10)
      .setStyle({ backgroundColor: '#468233' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => newGameButton.setStyle({ backgroundColor: '#1c4425' }))
      .on('pointerout', () => newGameButton.setStyle({ backgroundColor: '#468233' }));

    // load game button
    const loadGameButton = this.add
      .text(this.screenCenterX + 100, this.screenCenterY, 'Load Game', {
        fontFamily: 'bebas',
        fontSize: '20px',
        color: '#ebede9',
      })
      .setPadding(10)
      .setStyle({ backgroundColor: '#468233' })
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .on('pointerdown', () => this.loadGame())
      .on('pointerover', () => loadGameButton.setStyle({ backgroundColor: '#1c4425' }))
      .on('pointerout', () => loadGameButton.setStyle({ backgroundColor: '#468233' }));
  }

  startGame() {
    this.scene.start('MainScene');
  }

  loadGame() {
    this.scene.start('MainScene');
  }
}

export default StartScene;
