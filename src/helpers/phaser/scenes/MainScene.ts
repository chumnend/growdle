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
  private coinPool: Phaser.GameObjects.Group | null;
  private dmgTextPool: Phaser.GameObjects.Group | null;
  private upgradeButtons: Phaser.GameObjects.Group | null;
  private player: Player;
  private playerGoldText: Phaser.GameObjects.Text | null;
  private playerDmgText: Phaser.GameObjects.Text | null;

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
    this.coinPool = null;
    this.dmgTextPool = null;
    this.upgradeButtons = null;
    this.player = {
      clickDmg: 1,
      gold: 0,
    };
    this.playerGoldText = null;
    this.playerDmgText = null;
  }

  preload() {
    // get the center of the screen
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // load game assets
    this.preloadMonsterSprites();
    this.load.image('gold_coin', '/assets/icons/I_GoldCoin.png');
    this.load.image('dagger', '/assets/icons/W_Dagger002.png');

    // create upgrade panel texture
    const upgradePanelTexture = this.textures.createCanvas('upgradePanel', 200, 400); // origin is center
    upgradePanelTexture.context.fillStyle = '#9a783d';
    upgradePanelTexture.context.strokeStyle = '#35371c';
    upgradePanelTexture.context.lineWidth = 12;
    upgradePanelTexture.context.fillRect(0, 0, 200, 400);
    upgradePanelTexture.context.strokeRect(0, 0, 200, 400);
    upgradePanelTexture.refresh();

    // create panel button texture
    const buttonTexture = this.textures.createCanvas('button', 176, 48);
    buttonTexture.context.fillStyle = '#e6dec7';
    buttonTexture.context.strokeStyle = '#35371c';
    buttonTexture.context.lineWidth = 4;
    buttonTexture.context.fillRect(0, 0, 225, 48);
    buttonTexture.context.strokeRect(0, 0, 225, 48);
    buttonTexture.refresh();
  }

  create() {
    this.createMonsterPool();
    this.createCoinPool();
    this.createDmgTextPool();

    this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
      font: '24px Arial Black',
      color: '#fff',
      strokeThickness: 2,
    });

    // draw upgrade panel
    this.add.image(110, 280, 'upgradePanel');

    this.upgradeButtons = this.add.group();
    const attackUpgradeButton = this.add
      .image(110, 116, 'button')
      .setInteractive()
      .on('pointerdown', this.onClickUpgrade.bind(this));
    this.add.image(42, 116, 'dagger');
    this.playerDmgText = this.add.text(80, 104, 'Attack: ' + this.player.clickDmg, {
      font: '24px Arial Black',
      color: '#000',
    });
    this.upgradeButtons.add(attackUpgradeButton);

    // load the first monster into the game
    this.getRandomMonster();
  }

  // preloads sprites using monster data
  preloadMonsterSprites() {
    this.monsterData.forEach((monster) => {
      this.load.image(monster.image, `assets/sprites/${monster.image}.png`);
    });
  }

  createMonsterPool() {
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
  }

  createCoinPool() {
    this.coinPool = this.add.group();
    this.coinPool.createMultiple({
      key: 'gold_coin',
      quantity: 50,
      setXY: {
        x: 2000,
        y: 0,
      },
    });
    this.coinPool.children.each((coin) => {
      coin.active = false;
      coin.setInteractive();
      coin.on('pointerdown', this.onClickCoin.bind(this, coin));
    });
  }

  createDmgTextPool() {
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
    this.currentMonster.setPosition(this.screenCenterX + this.currentMonster.width / 2 + 100, this.screenCenterY);
    this.currentMonsterNameText?.destroy();

    // update monster information
    this.currentMonsterNameText = this.add.text(
      this.screenCenterX - 100,
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
      this.screenCenterX - 100,
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
        // add coin to world
        const coin = this.coinPool?.getFirst(false);
        coin.active = true;
        coin.x = this.screenCenterX + Phaser.Math.Between(0, 200);
        coin.y = this.screenCenterY + Phaser.Math.Between(-100, 100);

        // set coin to auto click
        this.time.delayedCall(3000, () => this.onClickCoin(coin));

        // if died, load new monster
        this.getRandomMonster();
      } else {
        this.currentMonster.data = updatedData;
      }
    }
  }

  onClickCoin(coin: Phaser.GameObjects.GameObject) {
    if (!coin) {
      return;
    }

    this.player.gold += 1;
    if (this.playerGoldText) {
      this.playerGoldText.text = 'Gold: ' + this.player.gold;
    }
    coin.destroy();
  }

  onClickUpgrade() {
    if (this.player.gold - 5 >= 0) {
      this.player.gold -= 5;
      if (this.playerGoldText) {
        this.playerGoldText.text = 'Gold: ' + this.player.gold;
      }
      this.player.clickDmg++;
      if (this.playerDmgText) {
        this.playerDmgText.text = 'Attack: ' + this.player.clickDmg;
      }
    }
  }
}

export default MainScene;
