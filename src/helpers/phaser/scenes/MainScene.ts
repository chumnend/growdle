import Phaser from 'phaser';

class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private currentMonster: Phaser.GameObjects.Sprite | null;
  private currentMonsterText: Phaser.GameObjects.Text | null;
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
    this.currentMonsterText = null;
    this.monsters = null;
  }

  preload() {
    // get the center of the screen
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.preloadMonsterSprites();
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
      monster.on('pointerdown', this.getRandomMonster.bind(this));
    });

    // load the first monster into the game
    this.getRandomMonster();
  }

  // preloads sprites using monster data
  preloadMonsterSprites() {
    this.monsterData.forEach((monster) => {
      this.load.image(monster.image, `assets/sprites/${monster.image}.png`);
    });
  }

  lookupMonsterName(): string {
    const data = this.monsterData.find((monster) => monster.image === this.currentMonster?.texture.key);
    return data?.name ?? 'unknown';
  }

  getRandomMonster() {
    if (this.currentMonster) {
      // reset current monster
      this.currentMonster.setPosition(2000, this.screenCenterY);
    }

    // pick new monster
    this.currentMonster = this.monsters?.getChildren()[
      Phaser.Math.Between(0, this.monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;

    // move new monster to center of the screen
    this.currentMonster.setPosition(this.screenCenterX + this.currentMonster.width / 2, this.screenCenterY);
    this.currentMonsterText?.destroy();
    this.currentMonsterText = this.add.text(this.screenCenterX - 200, this.screenCenterY, this.lookupMonsterName());
  }
}

export default MainScene;
