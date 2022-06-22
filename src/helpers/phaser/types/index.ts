export type Player = {
  /** the amount of gold earned */
  gold: number;
  /** the amount of damage the player character does */
  clickDmg: number;
  /** the amount of idle damage done over time */
  dpsDmg: number;
};

export type World = {
  /** the current level of the world */
  level: number;
  /** the number of kills on the current level */
  currentKills: number;
  /** the number of kills required to advance the world level */
  requiredKills: number;
};

export type Monster = {
  /** the name of the monster */
  name: string;
  /** the name of the sprite for the monster */
  image: string;
  /** the maximum health of the monster */
  maxHealth: number;
};

export type Upgrade = {
  /** the icon used in the upgrade button */
  icon: string;
  /** the name of what is upgraded */
  name: string;
  /** the current level of the upgrade */
  level: number;
  /** the cost of the upgrade */
  cost: number;
  /** the logic for updating the stat of the player */
  purchaseHandler: () => void;
};

export type SaveData = {
  /** Data about the player */
  player: Player;
  /** Data about the world */
  world: World;
};
