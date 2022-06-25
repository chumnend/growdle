import { SaveData } from '../types';

export const save = (data: SaveData) => {
  window.localStorage.setItem('savedData', JSON.stringify(data));
};

export const load = (): SaveData => {
  const data = window.localStorage.getItem('savedData');
  if (data) {
    return JSON.parse(data);
  }
  return {
    player: {
      clickDmg: 1,
      gold: 0,
      dpsDmg: 0,
    },
    world: {
      level: 1,
      currentKills: 0,
      requiredKills: 10,
    },
  };
};
