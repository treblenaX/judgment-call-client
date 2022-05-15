import '../styles/App.scss';
import Footer from './Footer';
import DebugMenu from './DebugMenu';
import Home from './Home';
import Lobby from './Lobby';
import { GameStates } from '../constants/GameStates';
import TextAreaModule from './TextAreaModule';
import Judgment from './Judgment';
import Scenario from './Scenario';
import Discussion from './Discussion';
import Loading from './Loading';
import Mitigation from './Mitigation';
import Summary from './Summary';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { SocketService } from '../services/SocketService';

const DEBUG = false;
const PAGE_IDS = [
  'home', 
  'lobby', 
  'textarea', 
  'judgment', 
  'scenario', 
  'discussion', 
  'loading', 
  'mitigation',
  'summary'
];

// @TODO handle this better
export const SERVER_ENDPOINT = (DEBUG) ? 'http://localhost:3000' : 'https://judgment-call.herokuapp.com';

function App() {
  // App data states
  const [playerName, setPlayerName] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [isClientHost, setClientHost] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // States that have passed through multiple components 
  const [gameState, setGameState] = useState(GameStates.INIT);
  const [gameMaster, setGameMaster] = useState(null);
  const [lobbyPlayers, setLobbyPlayers] = useState(null);
  const [lobbyReadyStatus, setLobbyReadyStatus] = useState(null);

  // Lobby data
  const [lobbyState, setLobbyState] = useState(null);
  const [clientPlayer, setClientPlayer] = useState(null);
  const [lobbyCode, setLobbyCode] = useState(null);

  // Discussion Data
  const [focusPlayer, setFocusPlayer] = useState(null);

  // whether or not to show the debug panel
  const [showDebug, setShowDebug] = useState(DEBUG);

  // defines what page to display
  const [pageId, setPage] = useState('home');

  const clientInfo = {
    playerName: playerName,
    joinLobbyCode: joinLobbyCode,
    isClientHost: isClientHost
  }

  const setLobbyStateCallbacks = {
    setGameState: setGameState,
    setLobbyPlayers: setLobbyPlayers,
    setLobbyReadyStatus: setLobbyReadyStatus,
    setClientPlayer: setClientPlayer,
    setGameMaster: setGameMaster,
    setFocusPlayer: setFocusPlayer,
    setEndTime: setEndTime
  };

  // @TODO: finish doing this ^
  const convertGameState = (gameState) => {
    switch (gameState) {
      case GameStates.INIT:
        return 'home';
      case GameStates.LOBBY:
        return 'lobby';
      case GameStates.LOADING:
        return 'loading';
      case GameStates.DEAL:
        return 'scenario';
    }
  }

  // find which page to display
  const getPage = () => {
    switch (pageId) {
      case 'home':
        return <Home
                  setPlayerNameCallback={setPlayerName} 
                  setPageCallback={setPage} 
                  setClientHostCallback={setClientHost}
                  setJoinLobbyCodeCallback={setJoinLobbyCode}
                  setGameStateCallback={setGameState}
                  setErrorStateCallback={setErrorState}
                />;
      case 'loading':
        return <Loading 
                  clientInfo={clientInfo}
                  setLobbyStateCallback={setLobbyState}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setClientPlayerCallback={setClientPlayer}
                  setClientHostCallback={setClientHost}
                  setLobbyCodeCallback={setLobbyCode}
                  setPageCallback={setPage}
                  setGameStateCallback={setGameState}
                  setErrorStateCallback={setErrorState}
              />;
      case 'lobby':
        return <Lobby 
                  playerName={playerName}
                  isClientHost={isClientHost}
                  joinLobbyCode={joinLobbyCode}
                  lobbyPlayers={lobbyPlayers}
                  lobbyState={lobbyState}
                  clientPlayer={clientPlayer}
                  lobbyCode={lobbyCode}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setClientPlayerCallback={setClientPlayer}
                  setPageCallback={setPage}
                  setErrorStateCallback={setErrorState}
                />;
      case 'textarea':
        return <TextAreaModule />;
      case 'judgment':
        return <Judgment 
                  clientPlayer={clientPlayer}
                  endTime={endTime}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setClientPlayerCallback={setClientPlayer}
                  setPageCallback={setPage}
                  setErrorStateCallback={setErrorState}
                />;
      case 'scenario':
        return <Scenario 
                  clientPlayer={clientPlayer}
                  gameMaster={gameMaster}
                  gameState={gameState}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setClientPlayerCallback={setClientPlayer}
                  setPageCallback={setPage}
                  setErrorStateCallback={setErrorState}
                />;
      case 'discussion':
        return <Discussion 
                  clientPlayer={clientPlayer}
                  lobbyPlayers={lobbyPlayers}
                  gameMaster={gameMaster}
                  focusPlayer={focusPlayer}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setPageCallback={setPage}
                  setErrorStateCallback={setErrorState}
                />;
      case 'mitigation':
        return <Mitigation 
                  clientPlayer={clientPlayer}
                  lobbyPlayers={lobbyPlayers}
                  gameMaster={gameMaster}
                  focusPlayer={focusPlayer}
                  lobbyStateCallbacks={setLobbyStateCallbacks}
                  setClientPlayerCallback={setClientPlayer}
                  setPageCallback={setPage}
                  setErrorStateCallback={setErrorState}
                />;
      case 'summary':
        return <Summary 
                clientPlayer={clientPlayer}
                lobbyPlayers={lobbyPlayers}
                endTime={endTime}
                gameMaster={gameMaster}
                lobbyStateCallbacks={setLobbyStateCallbacks}
                setPageCallback={setPage}
                setErrorStateCallback={setErrorState}
              />;
      default:
        return <>404: No such page {pageId}</>;
    }
  };

  /** Footer Handler */
  const footerTimeOut = (gameState) => {
    switch (gameState) {
      case GameStates.LOBBY:
        return () => {

        };
      case GameStates.REVIEW:
        return () => {

        };
      case GameStates.DISCUSS:
        return () => {

        };
      case GameStates.MITIGATION:
        return () => {

        };
      case GameStates.JUDGMENT_CALL:
        return () => {

        };
      case GameStates.OUTPUT:
        return () => {

        };
    }
  }

  // useEffect
  useEffect(() => {
    // SocketService.debug();
    if (errorState) {
      toast.error('' + errorState);
    }
  }, [errorState]);

  return (
    <>
      {showDebug ? <DebugMenu setDebugCallback={setShowDebug} setPageCallback={setPage} ids={PAGE_IDS}/> : null}
      { getPage() }
      <Footer 
        footerTimeOutCallback={footerTimeOut}
        lobbyPlayers={lobbyPlayers}
        lobbyReadyStatus={lobbyReadyStatus}
        gameState={gameState}
      />
      <ToastContainer />
    </>
  );
}

export default App;
