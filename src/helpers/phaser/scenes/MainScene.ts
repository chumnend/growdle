import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private currentMonster: Phaser.GameObjects.Sprite | null;
  private monsters: Phaser.GameObjects.Group | null;

  // monster data based on sprites found in /public
  private monsterData = [
    { name: 'Aerocephal', image: 'aerocephal' },
    { name: 'Arcana Drake', image: 'arcana_drake' },
    { name: 'Aurum Drakueli', image: 'aurum-drakueli' },
    { name: 'Bat', image: 'bat' },
    { name: 'Daemarbora', image: 'daemarbora' },
    { name: 'Deceleon', image: 'deceleon' },
    { name: 'Demonic Essence', image: 'demonic_essence' },
    { name: 'Dune Crawler', image: 'dune_crawler' },
    { name: 'Green Slime', image: 'green_slime' },
    { name: 'Nagaruda', image: 'nagaruda' },
    { name: 'Rat', image: 'rat' },
    { name: 'Scorpion', image: 'scorpion' },
    { name: 'Skeleton', image: 'skeleton' },
    { name: 'Snake', image: 'snake' },
    { name: 'Spider', image: 'spider' },
    { name: 'Stygian Lizard', image: 'stygian_lizard' },
  ];

  constructor() {
    super('MainScene');

    this.screenCenterX = 0;
    this.screenCenterY = 0;
    this.currentMonster = null;
    this.monsters = null;
  }

  preload() {
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // preloads monster sprites using monsterData
    this.loadMonsterSprites();
  }

  create() {
    this.monsters = this.add.group();
    this.monsterData.forEach((data) => {
      // create sprite for each, off screen
      const monster = this.monsters?.create(2000, this.screenCenterY, data.image);

      // each sprite is saved as set of 4, we need to only load 1
      monster.frame.width = monster.frame.width / 4;
      monster.frame.cutHeight = monster.frame.height;
      monster.frame.cutWidth = monster.frame.width;
      monster.frame.updateUVs();

      // move anchor to center of image
      monster.setOrigin(0.5, 0.5);

      // make the sprite clickable
      monster.setInteractive();
      monster.on('pointerdown', this.onClickMonster.bind(this));
    });

    this.currentMonster = this.monsters.getChildren()[
      Phaser.Math.Between(0, this.monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;
    this.currentMonster.setPosition(this.screenCenterX + 100, this.screenCenterY);
    this.add.text(
      this.screenCenterX - this.currentMonster.width / 2,
      this.screenCenterY + this.currentMonster.height / 2,
      '<NAME>',
    );
  }

  // loads sprites using monster data
  loadMonsterSprites() {
    this.monsterData.forEach((monster) => {
      this.load.image(monster.image, `assets/sprites/${monster.image}.png`);
    });
  }

  // when monster is clicked, replaces current monster with random monster
  onClickMonster() {
    // reset current monster
    this.currentMonster?.setPosition(2000, this.screenCenterY);

    // pick new monster
    this.currentMonster = this.monsters?.getChildren()[
      Phaser.Math.Between(0, this.monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;

    // move new monster to center of the screen
    this.currentMonster.setPosition(this.screenCenterX + 100, this.screenCenterY);
    this.add.text(
      this.screenCenterX - this.currentMonster.width / 2,
      this.screenCenterY + this.currentMonster.height / 2,
      '<NAME>',
    );
  }
}

export default MainScene;
