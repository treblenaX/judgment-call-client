import { useEffect } from 'react';
import { useTimer } from 'use-timer';
import { SocketService } from '../services/SocketService';
import '../styles/Footer.scss';

function Footer(props) {
    const playerStatus = props.playerStatus ? props.playerStatus : 'Made With <3 By Elbert Cheng & Alan Wen';
    const { time, start, pause, reset, status } = useTimer();

    const [gameTimer, setGameTimer] = useState(null);

    useEffect(() => {
        // Handle time counters
        SocketService.startGameListener(setGameCounter);
        SocketService.stopCountDownListener(setGameCounter);
    }, []);

    return (
        <footer>
            <span id='player-status'>{playerStatus}</span>
        </footer>
    )
}

export default Footer;