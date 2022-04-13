import './App.css';
import { useContext, useEffect, useState } from 'react';

import LobbyComponent from './components/LobbyComponent.js';
import { Textbox } from 'react-inputs-validation';
import { doesLobbyExist } from './services/socket';

const ENDPOINT = 'http://localhost:3000/';

function App() {
  // const [socket, setSocket] = useState(null);
  const [showLobby, setLobby] = useState(null);
  const [player, setPlayer] = useState(null);
  const [joinCode, setJoinCode] = useState(null);
  const [socketConnection, setConnection] = useState(false);
  const [toLobbyHandle, setLobbyHandle] = useState(false);
  // const socket = useContext(SocketContext);

  useEffect(() => {
    // console.log(socket);
    // socket.on('connected', data => console.log(data));

    // CLEAN UP EFFECT
    // return () => socket.disconnect(); 
  }, []);
  
  return (
    <div className="app-container">
      {
        !toLobbyHandle 
          ? <WelcomeComponent player={ player } setPlayer={ setPlayer } setLobbyHandle={ setLobbyHandle } />
          : <HandleLobbyComponent player={ player } />
      }
    </div>
  );
}

function WelcomeComponent(props) {
  const player = props.player;
  const setPlayer = props.setPlayer;
  const setLobbyHandle = props.setLobbyHandle;

  const handleNextButton = () => {
    // @TODO: create better validation
    if (!player) {
      alert('Please enter a username.');
    } else {
      setLobbyHandle(true);
    }
  }

  return (
    <div className="flex-container">
      <h1 className="flex-item">
        Judgment Call
      </h1>
      <h2 className="flex-item">
        Welcome! Who should we call you by?
      </h2>
      <div className="flex-item">
        <input type="text" id="username-input" onChange={(e) => setPlayer(e.target.value)} />
        <button type="button" onClick={() => handleNextButton()}>Next</button>
      </div>
    </div>
  );
}

function HandleLobbyComponent(props) {
  const player = props.player;
  const [joinCode, setJoinCode] = useState(null);
  const [showLobby, setLobby] = useState(null);
  const [goToJoin, setGoToJoin] = useState(false);

  const initHTML = (
    <div>
      <div>
        <h2>
          Will you be joining a lobby? Or creating a new one?
        </h2>
      </div>
      {
        !goToJoin
          ? (       // Main lobby menu
            <div>
              <div>
                <label>Enter Join Code: </label>
                {/* <Textbox 
                  attributesInput={{
                    placeholder: 'Please enter join code here.'
                  }}
                  validationOption={{type: 'number', min: 0, max: 6 }} 
                  onChange={(e) => setJoinCode(e.target.value)} 
                /> */}
                <input type="text" id="lobby-code-input" onChange={(e) => setJoinCode(e.target.value)} />
              </div>
              <button type="button" id="join-lobby-page-button" onClick={() => handleJoinLobbyPage(setGoToJoin)}>Join an Existing Lobby</button>
              <button type="button" id="create-lobby-button" onClick={() => handleCreateLobby()}>Create a new Lobby</button>
            </div>
          )
          : (       // Join code prompt menu 
            <div>
              <label>Please enter the existing lobby code to join!</label>
              <input type="text" id="lobby-code-input" onChange={(e) => setJoinCode(e.target.value)} />
              <button type="button" id="join-lobby-button" onClick={() => handleJoinLobby()}>Join Lobby</button>
            </div>
          )
      }
    </div>
  );

  const handleCreateLobby = () => {
    setLobby(<LobbyComponent player={ player } isHost={ true } />);
  };

  const handleJoinLobbyPage = (setGoToJoin) => {
    setGoToJoin(true);
  };

  const handleJoinLobby = () => {
    // @TODO: create better validation
    if (!joinCode) {
      alert('Please enter a join code.');
    } else {
      doesLobbyExist(joinCode)
        .then((existence) => {
          if (existence) {
            setLobby(<LobbyComponent player={ player } isHost={ false } joinCode={ joinCode } />)
          } else {
            alert('lobby does not exist');  // @TODO: Better handling of error
          }
        });
    }
  };

  return (
    <div>
      {
        !showLobby 
          ? initHTML
          : showLobby
      }
    </div>
  );
}

export default App;
