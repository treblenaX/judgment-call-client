import '../styles/DebugMenu.scss'

function DebugMenu(props) {
    const onHideDebug = () => {
        props.setDebugCallback(false);
    }

    const onClick = (event) => {
        // home button
        if (event.target.id === 'home') {
            console.log('Debug set page to Home');
            props.setPageCallback('home');
        }
        // lobby button
        if (event.target.id === 'lobby') {
            console.log('Debug set page to Lobby');
            props.setPageCallback('lobby');
        }
    }

    return (
        <div className='debug-panel'>
            <h1>Debug Panel</h1>
            <ul>
                <li><button id='home' onClick={onClick}>Home</button></li>
                <li><button id='lobby' onClick={onClick}>Lobby</button></li>
            </ul>
            <button onClick={onHideDebug}>Hide Debug Panel</button>
        </div>
    )
}

export default DebugMenu;