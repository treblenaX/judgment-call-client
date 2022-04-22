import '../styles/DebugMenu.scss'

function DebugMenu(props) {
    const PAGE_IDS = props.ids;
    const onHideDebug = () => {
        props.setDebugCallback(false);
    }

    const onClick = (event) => {
        const page = event.target.id;
        console.log('Debug set page to' + page);
        props.setPageCallback(page);
    }

    const buttons = PAGE_IDS.map((pageId) => {
        return <li key={pageId}><button id={pageId} onClick={onClick}>{pageId}</button></li>
    });

    return (
        <div className='debug-panel'>
            <h1>Debug Panel</h1>
            <ul>{buttons}</ul>
            <button onClick={onHideDebug}>Hide Debug Panel</button>
        </div>
    )
}

export default DebugMenu;