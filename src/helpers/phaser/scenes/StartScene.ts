import Phaser from 'phaser';

class StartScene extends Phaser.Scene {
  private screenCenterX = 0;
  private screenCenterY = 0;

  constructor() {
    super('StartScene');
  }

  preload() {
    console.log('preloading StartScene');

    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }

  create() {
    console.log('creating StartScene');

    this.add
      .text(this.screenCenterX, this.screenCenterY - 200, 'Growdle: An Idle Game', {
        fontFamily: 'bebas',
        fontSize: '65px',
        color: '#fff',
      })
      .setOrigin(0.5)
      .setShadow(2, 2, '#333', 2, false, true);

    const button1 = this.add
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
      .on('pointerover', () => button1.setStyle({ backgroundColor: '#1c4425' }))
      .on('pointerout', () => button1.setStyle({ backgroundColor: '#468233' }));

    const button2 = this.add
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
      .on('pointerover', () => button2.setStyle({ backgroundColor: '#1c4425' }))
      .on('pointerout', () => button2.setStyle({ backgroundColor: '#468233' }));
  }

  startGame() {
    console.log('starting new game');
  }

  loadGame() {
    console.log('loading saved game');
  }
}

export default StartScene;
