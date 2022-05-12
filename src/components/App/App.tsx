import { useEffect } from 'react';

import logo from '../../helpers/assets/logo.svg';
import phaserGame from '../../helpers/phaser/PhaserGame';
import MainGameScene from '../../helpers/phaser/scenes/MainGameScene';
import './App.css';

const App = () => {
  useEffect(() => {
    phaserGame.scene.keys.MainGameScene as MainGameScene;
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Just a vanilla create-react-app overlaying a Phaser canvas</p>
      </header>
    </div>
  );
};

export default App;
