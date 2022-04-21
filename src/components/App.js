import '../styles/App.scss';
import Footer from './Footer';
import DebugMenu from './DebugMenu';
import Home from './Home';
import Lobby from './Lobby';
import React, { useState } from 'react';

<<<<<<< HEAD
const DEBUG = true;

export const SERVER_ENDPOINT = (DEBUG) ? 'http://localhost:3000' : 'http://judgment-call.herokuapp.com/';

function App() {
  // App data states
  const [playerName, setPlayerName] = useState('');
  const [joinLobbyCode, setJoinLobbyCode] = useState('');
  const [isClientHost, setClientHost] = useState(false);

  // whether or not to show the debug panel
  const [showDebug, setShowDebug] = useState(DEBUG);
=======
function App() {
  // whether or not to show the debug panel
  const [showDebug, setShowDebug] = useState(true);
>>>>>>> 5499a50140a13018f08e38d7005faf0c03d376fb

  // defines what page to display
  const [pageId, setPage] = useState('home');

  // find which page to display
  const getPage = () => {
    switch (pageId) {
      case 'home':
<<<<<<< HEAD
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
=======
        return <Home />;
      case 'lobby':
        return <Lobby />;
>>>>>>> 5499a50140a13018f08e38d7005faf0c03d376fb
      default:
        return <>404: No such page {pageId}</>;
    }
  };

  return (
    <>
      {showDebug ? <DebugMenu setDebugCallback={setShowDebug} setPageCallback={setPage} /> : null}
      { getPage() }
      <Footer />
    </>
  );
}

export default App;
