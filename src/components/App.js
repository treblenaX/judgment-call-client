import '../styles/App.scss';
import Footer from './Footer';
import DebugMenu from './DebugMenu';
import Home from './Home';
import Lobby from './Lobby';
import React, { useState } from 'react';
import { GameStates } from '../constants/GameStates';

const DEBUG = true;

// @TODO handle this better
export const SERVER_ENDPOINT = (DEBUG) ? 'http://localhost:3000' : 'https://judgment-call.herokuapp.com';

function App() {
  // App data states
  const [playerName, setPlayerName] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [isClientHost, setClientHost] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // States that have passed through multiple components 
  const [isLoading, setLoading] = useState(false);
  const [gameState, setGameState] = useState(GameStates.INIT);
  const [lobbyPlayers, setLobbyPlayers] = useState(null);
  const [lobbyReadyStatus, setLobbyReadyStatus] = useState(null);

  // whether or not to show the debug panel
  const [showDebug, setShowDebug] = useState(DEBUG);

  // defines what page to display
  const [pageId, setPage] = useState('home');

  // find which page to display
  const getPage = () => {
    switch (pageId) {
      case 'home':
        return <Home 
                  setPlayerNameCallback={setPlayerName} 
                  setPageCallback={setPage} 
                  setClientHostCallback={setClientHost}
                  setJoinLobbyCodeCallback={setJoinLobbyCode}
                />;
      case 'lobby':
        return <Lobby 
                  playerName={playerName}
                  isClientHost={isClientHost}
                  joinLobbyCode={joinLobbyCode}
                  lobbyPlayers={lobbyPlayers}
                  isLoading={isLoading}
                  setLobbyPlayersCallback={setLobbyPlayers}
                  setLobbyReadyStatusCallback={setLobbyReadyStatus}
                  setGameStateCallback={setGameState}
                  setLoadingCallback={setLoading}
                />;
      default:
        return <>404: No such page {pageId}</>;
    }
  };

  return (
    <>
      {showDebug ? <DebugMenu setDebugCallback={setShowDebug} setPageCallback={setPage} /> : null}
      { getPage() }
      <Footer 
        lobbyPlayers={lobbyPlayers}
        lobbyReadyStatus={lobbyReadyStatus}
        gameState={gameState}
      />
    </>
  );
}

export default App;
