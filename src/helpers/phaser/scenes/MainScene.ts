import Phaser from 'phaser';

type Player = {
  /** the amount of damage the player character does */
  clickDmg: number;
  /** the amount of gold earned */
  gold: number;
};

type Monster = {
  /** the name of the monster */
  name: string;
  /** the name of the sprite for the monster */
  image: string;
  /** the maximum health of the monster */
  maxHealth: number;
};

class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;
  private currentMonster: Phaser.GameObjects.Sprite | null;
  private currentMonsterNameText: Phaser.GameObjects.Text | null;
  private currentMonsterHealthText: Phaser.GameObjects.Text | null;
  private monsterPool: Phaser.GameObjects.Group | null;
  private dmgTextPool: Phaser.GameObjects.Group | null;
  private player: Player;

  // monster data based on sprites found in /public
  private monsterData: Monster[] = [
    { name: 'Aerocephal', image: 'aerocephal', maxHealth: 10 },
    { name: 'Arcana Drake', image: 'arcana_drake', maxHealth: 20 },
    { name: 'Aurum Drakueli', image: 'aurum-drakueli', maxHealth: 30 },
    { name: 'Bat', image: 'bat', maxHealth: 5 },
    { name: 'Daemarbora', image: 'daemarbora', maxHealth: 10 },
    { name: 'Deceleon', image: 'deceleon', maxHealth: 10 },
    { name: 'Demonic Essence', image: 'demonic_essence', maxHealth: 15 },
    { name: 'Dune Crawler', image: 'dune_crawler', maxHealth: 8 },
    { name: 'Green Slime', image: 'green_slime', maxHealth: 3 },
    { name: 'Nagaruda', image: 'nagaruda', maxHealth: 13 },
    { name: 'Rat', image: 'rat', maxHealth: 2 },
    { name: 'Scorpion', image: 'scorpion', maxHealth: 2 },
    { name: 'Skeleton', image: 'skeleton', maxHealth: 6 },
    { name: 'Snake', image: 'snake', maxHealth: 4 },
    { name: 'Spider', image: 'spider', maxHealth: 4 },
    { name: 'Stygian Lizard', image: 'stygian_lizard', maxHealth: 20 },
  ];

  constructor() {
    super('MainScene');

    this.screenCenterX = 0;
    this.screenCenterY = 0;
    this.currentMonster = null;
    this.currentMonsterNameText = null;
    this.currentMonsterHealthText = null;
    this.monsterPool = null;
    this.dmgTextPool = null;
    this.player = {
      clickDmg: 1,
      gold: 0,
    };
  }

  preload() {
    // get the center of the screen
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.preloadMonsterSprites();
  }

  create() {
    this.monsterPool = this.add.group();
    this.monsterData.forEach((data) => {
      // create sprite for each, off screen
      const monster = this.monsterPool?.create(2000, this.screenCenterY, data.image);

      // each sprite is saved as set of 4, we need to only load 1
      monster.frame.width = monster.frame.width / 4;
      monster.frame.cutHeight = monster.frame.height;
      monster.frame.cutWidth = monster.frame.width;
      monster.frame.updateUVs();

      // add data to sprite
      monster.name = data.name;
      monster.data = {
        maxHealth: data.maxHealth,
        health: data.maxHealth,
      };

      // move anchor to center of image
      monster.setOrigin(0.5, 0.5);

      // make the sprite clickable
      monster.setInteractive();
      monster.on('pointerdown', this.onClickMonster.bind(this));
    });

    this.dmgTextPool = this.add.group();
    let dmgText;
    for (let i = 0; i < 50; i++) {
      dmgText = this.add.text(0, 0, '1', {
        font: '64px Arial Black',
        color: '#fff',
        strokeThickness: 2,
      });
      dmgText.alpha = 0;
      dmgText.active = false;
      this.dmgTextPool?.add(dmgText);
    }

    // load the first monster into the game
    this.getRandomMonster();
  }

  // preloads sprites using monster data
  preloadMonsterSprites() {
    this.monsterData.forEach((monster) => {
      this.load.image(monster.image, `assets/sprites/${monster.image}.png`);
    });
  }

  getRandomMonster() {
    if (this.currentMonster) {
      // reset current monster
      this.currentMonster.setPosition(2000, this.screenCenterY);
    }

    // pick new monster
    this.currentMonster = this.monsterPool?.getChildren()[
      Phaser.Math.Between(0, this.monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;

    // get monster data from sprite
    // eslint-disable-next-line
    const data = this.currentMonster.data as any;

    // revives the monster if dead
    data.health = data.maxHealth;
    this.currentMonster.data = data;

    // move new monster to center of the screen
    this.currentMonster.setPosition(this.screenCenterX + this.currentMonster.width / 2, this.screenCenterY);
    this.currentMonsterNameText?.destroy();
    this.currentMonsterNameText = this.add.text(
      this.screenCenterX - 200,
      this.screenCenterY - 40,
      this.currentMonster.name,
      {
        font: '24px Arial Black',
        color: '#fff',
        strokeThickness: 2,
      },
    );
    this.currentMonsterHealthText?.destroy();
    this.currentMonsterHealthText = this.add.text(
      this.screenCenterX - 200,
      this.screenCenterY + 40,
      data.health + ' HP',
      {
        font: '16px Arial Black',
        color: '#ff0000',
        strokeThickness: 2,
      },
    );
  }

  onClickMonster() {
    if (this.currentMonster) {
      // eslint-disable-next-line
      const updatedData = this.currentMonster?.data as any; // hacky way to handle unknown DataManager

      // on click, player deals damage to the monster
      updatedData.health = updatedData.health - this.player.clickDmg;
      if (this.currentMonsterHealthText) {
        this.currentMonsterHealthText.text = updatedData.health + ' HP';
      }

      const dmgText = this.dmgTextPool?.getFirst(false);
      if (dmgText) {
        dmgText.text = this.player.clickDmg;
        dmgText.alpha = 1;
        dmgText.active = true;
        this.tweens.add({
          targets: dmgText,
          alpha: 0,
          duration: 1000,
          ease: 'Cubic.easeOut',
          x: Phaser.Math.Between(100, 700),
          y: 100,
          onComplete: (_, targets: Phaser.GameObjects.Sprite[]) => {
            targets[0].destroy();
          },
        });
      }

      // check if dead
      if (updatedData.health <= 0) {
        // if died, load new monster
        this.getRandomMonster();
      } else {
        this.currentMonster.data = updatedData;
      }
    }
  }
}

export default MainScene;
