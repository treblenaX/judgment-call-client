import '../styles/App.scss';
import Footer from './Footer';
import DebugMenu from './DebugMenu';
import Home from './Home';
import Lobby from './Lobby';
import React, { useState } from 'react';

function App() {
  // whether or not to show the debug panel
  const [showDebug, setShowDebug] = useState(true);

  // defines what page to display
  const [pageId, setPage] = useState('home');

  // find which page to display
  const getPage = () => {
    switch (pageId) {
      case 'home':
        return <Home />;
      case 'lobby':
        return <Lobby />;
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
