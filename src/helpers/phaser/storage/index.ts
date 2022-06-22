import { SaveData } from '../types';

export const save = (data: SaveData) => {
  console.log('save');
};

export const load = (): SaveData => {
  console.log('load');

  return {
    player: {
      gold: 0,
      clickDmg: 1,
      dpsDmg: 0,
    },
    world: {
      level: 2,
      currentKills: 0,
      requiredKills: 10,
    },
  };
};
