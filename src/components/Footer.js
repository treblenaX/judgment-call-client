import { useEffect, useState } from 'react';
import { useTimer } from 'use-timer';
import { GameStates } from '../constants/GameStates.js';
import { SocketService } from '../services/SocketService.js';
import '../styles/Footer.scss';

function Footer(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyReadyStatus = props.lobbyReadyStatus;
    const gameState = props.gameState;
    
    const getFooter = () => {
        switch (gameState) {
            case GameStates.LOBBY:
                return <LobbyFooter 
                    lobbyPlayers={lobbyPlayers}
                    lobbyReadyStatus={lobbyReadyStatus}
                />;
            case GameStates.DEAL:
                return;
            default:
                return 'Made With <3 By Elbert Cheng & Alan Wen';
        }
    }

    return (
        <footer>
            <span id='player-status'>{getFooter()}</span>
        </footer>
    )
}

function LobbyFooter(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyReadyStatus = props.lobbyReadyStatus;
    const { time, start, pause, reset, status } = useTimer({
        initialTime: 5,
        timerType: 'DECREMENTAL',
        endTime: 0,
        onTimeOver: () => {
            console.log('time out');
        }

    });

    useEffect(() => {
        // Handle time counters
        SocketService.startGameListener(start);
        SocketService.stopCountDownListener(reset);
    }, []);

    // @TODO: alan plz beautify this
    return (
        <div>
            {`${convertSecondsToTime(time)} : ${lobbyReadyStatus.count}/${lobbyPlayers.length}`}
        </div>
    );
}

const convertSecondsToTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`
    }

    return `${minutes}:${seconds}`
}

export default Footer;