import '../styles/App.scss';
import Footer from './Footer';
import DebugMenu from './DebugMenu';
import Home from './Home';
import Lobby from './Lobby';
import TextAreaModule from './TextAreaModule';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';

const DEBUG = true;

// @TODO handle this better
export const SERVER_ENDPOINT = (DEBUG) ? 'http://localhost:3000' : 'https://judgment-call.herokuapp.com';

function App() {
  // App data states
  const [playerName, setPlayerName] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [isClientHost, setClientHost] = useState(false);
  const [errorState, setErrorState] = useState(null);

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
                />;
      case 'textarea':
        return <TextAreaModule />;
      default:
        return <>404: No such page {pageId}</>;
    }
  };

  // useEffect
  useEffect(() => {
    if (errorState) {
      toast.error(errorState);
    }
  }, [errorState]);

  return (
    <>
      {showDebug ? <DebugMenu setDebugCallback={setShowDebug} setPageCallback={setPage} /> : null}
      <ToastContainer />
      { getPage() }
      <Footer />
    </>
  );
}

export default App;
