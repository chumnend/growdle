import Phaser from 'phaser';

const monsterData = [
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

class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private currentMonster: Phaser.GameObjects.Sprite | null;
  private monsters: Phaser.GameObjects.Group | null;

  constructor() {
    super('MainScene');

    this.screenCenterX = 0;
    this.screenCenterY = 0;
    this.currentMonster = null;
    this.monsters = null;
  }

  preload() {
    console.log('preloading MainScene');

    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.load.image('aerocephal', 'assets/sprites/aerocephal.png');
    this.load.image('arcana_drake', 'assets/sprites/arcana_drake.png');
    this.load.image('aurum-drakueli', 'assets/sprites/aurum-drakueli.png');
    this.load.image('bat', 'assets/sprites/bat.png');
    this.load.image('daemarbora', 'assets/sprites/daemarbora.png');
    this.load.image('deceleon', 'assets/sprites/deceleon.png');
    this.load.image('demonic_essence', 'assets/sprites/demonic_essence.png');
    this.load.image('dune_crawler', 'assets/sprites/dune_crawler.png');
    this.load.image('green_slime', 'assets/sprites/green_slime.png');
    this.load.image('nagaruda', 'assets/sprites/nagaruda.png');
    this.load.image('rat', 'assets/sprites/rat.png');
    this.load.image('scorpion_goliath', 'assets/sprites/scorpion_goliath.png');
    this.load.image('scorpion', 'assets/sprites/scorpion.png');
    this.load.image('skeleton', 'assets/sprites/skeleton.png');
    this.load.image('snake', 'assets/sprites/snake.png');
    this.load.image('spider', 'assets/sprites/spider.png');
    this.load.image('stygian_lizard', 'assets/sprites/stygian_lizard.png');
  }

  create() {
    console.log('creating MainScene');

    this.monsters = this.add.group();
    monsterData.forEach((data) => {
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
      Phaser.Math.Between(0, monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;
    this.currentMonster.setPosition(this.screenCenterX + 100, this.screenCenterY);
    this.add.text(
      this.screenCenterX - this.currentMonster.width / 2,
      this.screenCenterY + this.currentMonster.height / 2,
      '<NAME>',
    );

    console.log(this.currentMonster);
  }

  onClickMonster() {
    console.log(this.currentMonster);

    // reset current monster
    this.currentMonster?.setPosition(2000, this.screenCenterY);

    // pick new monster
    this.currentMonster = this.monsters?.getChildren()[
      Phaser.Math.Between(0, monsterData.length - 1)
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
