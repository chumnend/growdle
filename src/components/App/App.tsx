import { useEffect } from 'react';

import phaserGame from '../../helpers/phaser';
import MainGameScene from '../../helpers/phaser/scenes/MainGameScene';

import './App.css';

const App = () => {
  useEffect(() => {
    phaserGame.scene.keys.MainGameScene as MainGameScene;
  }, []);

  return <div className="App"></div>;
};

export default App;
