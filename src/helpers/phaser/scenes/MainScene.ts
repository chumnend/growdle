import Phaser from 'phaser';

import { Player, World, Monster, Upgrade } from '../types';

class MainScene extends Phaser.Scene {
  private screenCenterX: number;
  private screenCenterY: number;

  private player: Player;
  private world: World;

  private monsterPool!: Phaser.GameObjects.Group;
  private coinPool!: Phaser.GameObjects.Group;
  private dmgTextPool!: Phaser.GameObjects.Group;

  private currentMonster!: Phaser.GameObjects.Sprite;
  private currentMonsterNameText!: Phaser.GameObjects.Text;
  private currentMonsterHealthText!: Phaser.GameObjects.Text;

  private playerGoldText!: Phaser.GameObjects.Text;
  private playerDmgText!: Phaser.GameObjects.Text;
  private playerDpsText!: Phaser.GameObjects.Text;
  private worldLevelText!: Phaser.GameObjects.Text;
  private worldKillsText!: Phaser.GameObjects.Text;

  // monster data based on sprites found in /public, for configuring monster sprites
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

  // upgrade data for configuring button in upgrade panel
  private upgradeButtonData: Upgrade[] = [
    {
      icon: 'sword',
      name: 'Attack',
      level: 1,
      cost: 5,
      purchaseHandler: () => {
        this.player.clickDmg += 1;
      },
    },
    {
      icon: 'magic',
      name: 'Auto',
      level: 0,
      cost: 10,
      purchaseHandler: () => {
        this.player.dpsDmg += 2;
      },
    },
  ];

  constructor() {
    super('MainScene');

    this.screenCenterX = 0;
    this.screenCenterY = 0;

    this.player = {
      clickDmg: 1,
      gold: 0,
      dpsDmg: 0,
    };

    this.world = {
      level: 1,
      currentKills: 0,
      requiredKills: 10,
    };
  }

  preload() {
    // get the center of the screen
    this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    this.screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // load game assets
    this.monsterData.forEach((monster) => {
      this.load.image(monster.image, `assets/sprites/${monster.image}.png`);
    });
    this.load.image('gold_coin', '/assets/icons/I_GoldCoin.png');
    this.load.image('sword', '/assets/icons/S_Sword15.png');
    this.load.image('magic', '/assets/icons/S_Magic11.png');

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
    // create coin sprites to show when monsters are defeated
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

    // create monster information text
    this.currentMonsterNameText = this.add.text(this.screenCenterX - 100, this.screenCenterY - 40, '', {
      font: '24px Arial Black',
      color: '#fff',
      strokeThickness: 2,
    });

    this.currentMonsterHealthText = this.add.text(this.screenCenterX - 100, this.screenCenterY + 40, '', {
      font: '16px Arial Black',
      color: '#ff0000',
      strokeThickness: 2,
    });

    // create damage text to show when monsters take damage
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
      this.dmgTextPool.add(dmgText);
    }

    // create text showing amount of gold the player has
    this.playerGoldText = this.add.text(30, 30, 'Gold: ' + this.player.gold, {
      font: '24px Arial Black',
      color: '#fff',
      strokeThickness: 2,
    });

    // create world information text
    this.worldLevelText = this.add.text(this.screenCenterX, 30, 'Level: ' + this.world.level, {
      font: '24px Arial Black',
      color: '#fff',
      strokeThickness: 2,
    });

    // create kill counter text
    this.worldKillsText = this.add.text(
      this.screenCenterX,
      56,
      'Kills: ' + this.world.currentKills + '/' + this.world.requiredKills,
      {
        font: '24px Arial Black',
        color: '#fff',
        strokeThickness: 2,
      },
    );

    // create the upgrade panel
    this.add.image(110, 280, 'upgradePanel');

    this.upgradeButtonData.forEach((data, index) => {
      this.add
        .image(110, 116 + 54 * index, 'button')
        .setInteractive()
        .on('pointerdown', this.onClickUpgrade.bind(this, data));
      this.add.image(42, 116 + 54 * index, data.icon);

      switch (index) {
        case 0:
          this.playerDmgText = this.add.text(80, 100 + 54 * index, data.name + ': ' + this.player.clickDmg, {
            font: '16px Arial Black',
            color: '#000',
          });
          this.add.text(80, 116 + 54 * index, 'Cost: ' + data.cost, {
            font: '16px Arial Black',
            color: '#000',
          });
          break;
        case 1:
          this.playerDpsText = this.add.text(80, 100 + 54 * index, data.name + ': ' + this.player.dpsDmg, {
            font: '16px Arial Black',
            color: '#000',
          });
          this.add.text(80, 116 + 54 * index, 'Cost: ' + data.cost, {
            font: '16px Arial Black',
            color: '#000',
          });
          break;
      }
    });

    // create timer to deal auto damage every second
    this.time.addEvent({
      delay: 1000,
      callback: this.onDPS,
      callbackScope: this,
      loop: true,
    });

    // creates all monster sprites off scren
    this.monsterPool = this.add.group();
    this.monsterData.forEach((data) => {
      // create sprite for each, off screen
      const monster = this.monsterPool.create(2000, this.screenCenterY, data.image);

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

    // load the first monster into the game
    this.getRandomMonster();
  }

  getRandomMonster() {
    this.currentMonster = this.monsterPool.getChildren()[
      Phaser.Math.Between(0, this.monsterData.length - 1)
    ] as Phaser.GameObjects.Sprite;

    // revives the monster if dead
    this.reviveMonster();

    // move new monster to center of the screen
    this.currentMonster.setPosition(this.screenCenterX + this.currentMonster.width / 2 + 100, this.screenCenterY);

    // update monster information
    this.updateText();
  }

  dealDamage(damage: number) {
    // eslint-disable-next-line
    const data = this.currentMonster.data as any; // hacky way to handle unknown DataManager

    // on click, player deals damage to the monster
    data.health = data.health - damage;
    this.currentMonster.data = data;

    // update monster information
    this.updateText();

    // check if dead
    if (data.health <= 0) {
      this.onMonsterKilled();
    }
  }

  reviveMonster() {
    // get monster data from sprite
    // eslint-disable-next-line
    const data = this.currentMonster.data as any;

    // revives the monster if dead
    data.health = data.maxHealth;
    this.currentMonster.data = data;
  }

  updateText() {
    // get monster data from sprite
    // eslint-disable-next-line
    const data = this.currentMonster.data as any;

    this.currentMonsterNameText.text = this.currentMonster.name;
    this.currentMonsterHealthText.text = data.health + ' HP';
    this.playerGoldText.text = 'Gold: ' + this.player.gold;
    this.playerDmgText.text = 'Attack: ' + this.player.clickDmg;
    this.playerDpsText.text = 'Auto: ' + this.player.dpsDmg;
    this.worldLevelText.text = 'Level: ' + this.world.level;
    this.worldKillsText.text = 'Kills: ' + this.world.currentKills + '/' + this.world.requiredKills;
  }

  onClickMonster() {
    const dmgText = this.dmgTextPool.getFirst(false);
    if (dmgText) {
      dmgText.active = true;
      dmgText.text = this.player.clickDmg;
      dmgText.x = 0;
      dmgText.y = 0;
      dmgText.alpha = 1;
      this.tweens.add({
        targets: dmgText,
        alpha: 0,
        duration: 1000,
        ease: 'Cubic.easeOut',
        x: Phaser.Math.Between(100, 700),
        y: 100,
        onComplete: (_, targets: Phaser.GameObjects.Sprite[]) => {
          // reset the damage text
          targets[0].active = false;
        },
      });
    }

    this.dealDamage(this.player.clickDmg);
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

  onClickUpgrade(data: Upgrade) {
    if (this.player.gold - data.cost >= 0) {
      this.player.gold -= data.cost;
      data.purchaseHandler.call(this);
      this.updateText();
    }
  }

  onDPS() {
    if (this.player.dpsDmg > 0) {
      this.dealDamage(this.player.dpsDmg);
    }
  }

  onMonsterKilled() {
    // increment world statistics
    this.world.currentKills++;
    if (this.world.currentKills >= this.world.requiredKills) {
      this.world.level++;
      this.world.currentKills = 0;
      this.world.requiredKills += 10;
    }
    this.updateText();

    // add coin to world
    const coin = this.coinPool.getFirst(false);
    coin.active = true;
    coin.x = this.screenCenterX + Phaser.Math.Between(0, 200);
    coin.y = this.screenCenterY + Phaser.Math.Between(-100, 100);

    // set coin to auto click
    this.time.delayedCall(3000, () => this.onClickCoin(coin));

    // move old monster off screen
    this.currentMonster.setPosition(2000, this.screenCenterY);

    // get a new monster
    this.getRandomMonster();
  }
}

export default MainScene;
