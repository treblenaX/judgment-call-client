import './App.css';
import { useContext, useEffect, useState } from 'react';

import LobbyComponent from './components/LobbyComponent.js';
import { Textbox } from 'react-inputs-validation';
import { doesLobbyExist } from './services/socket';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import { SocketService } from './services/SocketService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { LobbyService } from './services/LobbyService';

export const ENDPOINT = 'http://localhost:3000';

const TIMEOUT = 5000;

function App() {
  // const [socket, setSocket] = useState(null);
  const [showLobby, setLobby] = useState(null);
  const [player, setPlayer] = useState(null);
  const [lobbyCode, setLobbyCode] = useState(null);
  const [socketConnection, setConnection] = useState(false);
  const [homePage, toHomePage] = useState(true);
  // const socket = useContext(SocketContext);

  useEffect(() => {

  }, []);
  
  return (
    <div className="flex-container">
      <HeaderComponent />
      <div className="flex-item body">
        {
          homePage 
            ? <WelcomeComponent player={ player } setPlayer={ setPlayer } toHomePage={ toHomePage } />
            : <HandleLobbyComponent player={ player } toHomePage={ toHomePage }/>
        }
      </div>
      <div className="footer">
        <FooterComponent />
      </div>
    </div>
  );
}

function WelcomeComponent(props) {
  const player = props.player;
  const setPlayer = props.setPlayer;
  const toHomePage = props.toHomePage;

  const handleNextButton = () => {
    // @TODO: create better validation
    if (!player) {
      alert('Please enter a username.');
    } else {
      toHomePage(false);
    }
  }

  return (
    <div className="flex-container">
      <h2 className="flex-item">
        Welcome! Who are you?
      </h2>
      <div className="flex-item">
        <input type="text" className="input-box" onChange={(e) => setPlayer(e.target.value)} />
        <button type="button" onClick={() => handleNextButton()}>Next</button>
      </div>
    </div>
  );
}

function HandleLobbyComponent(props) {
  const player = props.player;
  const toHomePage = props.toHomePage;
  const [lobbyCode, setLobbyCode] = useState(null);
  const [showLobby, setLobby] = useState(null);
  const [goToJoin, setGoToJoin] = useState(false);

  const initHTML = (
    <div className="flex-container">
      <div className="flex-item">
        <h1>
          Hello, {player}!
        </h1>
        <h2>
          Will you be joining a lobby? Or creating a new one?
        </h2>
      </div>
      <div className="flex-item">
        {
          !goToJoin
            ? 
            <div className="flex-item">
              <button type="button" id="join-lobby-page-button" onClick={() => handleJoinLobbyPage(setGoToJoin, true)}>Join an Existing Lobby</button>
              <button type="button" id="create-lobby-button" onClick={() => handleCreateLobby()}>Create a new Lobby</button>
            </div>
            :
            <div className="flex-item">
              <div className="flex-item">
                <label>Please enter the existing lobby code to join!</label>
              </div>
              <div className="flex-item">
                <input type="text" id="lobby-code-input" onChange={(e) => setLobbyCode(e.target.value)} />
                <button type="button" id="join-lobby-button" onClick={() => handleJoinLobby()}>Join Lobby</button>
              </div>
              <div className="flex-item">
                <button type="button" id="join-lobby-back-button" onClick={() => handleJoinLobbyPage(setGoToJoin, false)}>Back</button>
              </div>
            </div>
        }
      </div>
    </div>
  );

  /** Handlers */
  const handleCreateLobby = async () => {
    // @TODO: learn about how to structure network stuff
    // 1. Build request
    const request = {
      playerName: player,
      newLobby: true
    };

    // 2. funnel request through
    const response = await LobbyService.createLobby(request);
    console.log(response);
  
    // setLobby(<LobbyComponent player={ player } isHost={ true } setLobby={ setLobby } />);
  };

  const handleJoinLobbyPage = (setGoToJoin, bool) => {
    setGoToJoin(bool);
  };

  const handleJoinLobby = async () => {
    // @TODO: create better validation
    // if (!lobbyCode) {
    //   alert('Please enter a join code.');
    // } else {
      const request = {
        playerName: player,
        lobbyCode: lobbyCode
      }
      const response = await LobbyService.joinLobby(request);

      console.log(response);

      // doesLobbyExist(lobbyCode)
      //   .then((existence) => {
      //     if (existence) {
      //       setLobby(<LobbyComponent player={ player } isHost={ false } lobbyCode={ lobbyCode } />)
      //     } else {
      //       alert('lobby does not exist');  // @TODO: Better handling of error
      //     }
      //   });
    // }
  };

  return (
    <div>
      <div>
        { !showLobby ? <LoadingComponent toHomePage={ toHomePage } /> : <span></span> }
      </div>
      <div>
        {
          !showLobby 
            ? initHTML
            : showLobby
        }
      </div>
    </div>
  );
}

function LoadingComponent(props) {
  const toHomePage = props.toHomePage;
  const [isLoading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');

  /** Async functions */
  async function handleServerInit(setLoading) {
    setLoadingMessage('Connecting to the server...');
    const connectionResult = await SocketService.connectToServer();

    // If a connection issue occurs, then reset to home page
    if (connectionResult.error) {
      setLoadingMessage('Cannot connect to the server. Redirecting back to the home page.');
      
      // Wait for $TIMEOUT to redirect back to the home page
      // await setTimeout(() => { 
      //   toHomePage(true);
      // }, TIMEOUT);
      setLoading(false);
      return;
    }

    setLoadingMessage('Connected!');
    setLoading(false);  
  }

  useEffect(() => {
    // handleServerInit(setLoading);  
  }, []);

  return (
    <div>
        <span>Server Connection:</span>
        <p>
          { loadingMessage } { isLoading ? <FontAwesomeIcon spin={ true } icon={faSpinner} /> : <span></span> }
        </p>
    </div>
  )
}

export default App;
