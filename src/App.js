import './App.css';
import { useContext, useEffect, useState } from 'react';

import LobbyComponent from './components/LobbyComponent.js';

const ENDPOINT = 'http://localhost:3000/';

function App() {
  // const [socket, setSocket] = useState(null);
  const [showLobby, setLobby] = useState(null);
  const [player, setPlayer] = useState(null);
  const [joinCode, setJoinCode] = useState(null);
  const [socketConnection, setConnection] = useState(false);
  // const socket = useContext(SocketContext);

  useEffect(() => {
    // console.log(socket);
    // socket.on('connected', data => console.log(data));

    // CLEAN UP EFFECT
    // return () => socket.disconnect(); 
  }, []);

  const handleCreateLobby = () => {
    setLobby(<LobbyComponent player={ player } isHost={ true } />);
  };

  const handleJoinLobby = () => {
    setLobby(<LobbyComponent player={ player } isHost={ false } joinCode={ joinCode } />);
  }
  
  return (
    <div className="App">
      <h1>Judgment Call</h1>
      { !showLobby 
        ?
        <div>
          <div>
            <label>Enter Username: </label>
            <input type="text" id="username-input" onChange={(e) => setPlayer(e.target.value)} />
          </div>
          <div>
            <label>Enter Join Code: </label>
            <input type="text" id="lobby-code-input" onChange={(e) => setJoinCode(e.target.value)} />
          </div>
          <button type="submit" id="create_lobby_button" onClick={() => handleCreateLobby()} >Create Lobby</button>
          <button type="submit" id="join_lobby_button" onClick={() => handleJoinLobby()} >Join Lobby</button>
        </div>
        : 
        showLobby
      }
    </div>
  );
}

export default App;
