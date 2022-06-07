import { useEffect } from 'react';

import phaserGame from '../../helpers/phaser';
import MainScene from '../../helpers/phaser/scenes/MainScene';

import './App.css';

const App = () => {
  useEffect(() => {
    phaserGame.scene.keys.MainScene as MainScene;
  }, []);

  return <div className="App"></div>;
};

export default App;
