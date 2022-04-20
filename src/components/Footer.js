import '../styles/Footer.scss';

function Footer(props) {
    const playerStatus = props.playerStatus ? props.playerStatus : 'Made With <3 By Elbert Cheng & Alan Wen';
    return (
        <footer>
            <span id='player-status'>{playerStatus}</span>
        </footer>
    )
}

export default Footer;