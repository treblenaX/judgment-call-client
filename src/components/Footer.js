import { useEffect, useState } from 'react';
import { useTimer } from 'use-timer';
import { GameStates } from '../constants/GameStates.js';
import { SocketService } from '../services/SocketService.js';
import { TimerService } from '../services/TimerService.js';
import '../styles/Footer.scss';

function Footer(props) {
    const footerTimeOutCallback = props.footerTimeOutCallback;
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyReadyStatus = props.lobbyReadyStatus;
    const gameState = props.gameState;
    
    const getFooter = () => {
        switch (gameState) {
            case GameStates.LOBBY:
                return (
                    <div>
                        <LobbyTimer /> : <ReadyCount lobbyPlayers={lobbyPlayers} lobbyReadyStatus={lobbyReadyStatus} />
                    </div>
                );
            case GameStates.REVIEW:
                return (
                    <div>
                        <ReviewTimer /> : <ReadyCount lobbyPlayers={lobbyPlayers} lobbyReadyStatus={lobbyReadyStatus} />
                    </div>
                );
            case GameStates.DISCUSS: 
                return (
                    <div>
                        <DiscussionTimer /> : <ReadyCount lobbyPlayers={lobbyPlayers} lobbyReadyStatus={lobbyReadyStatus} />
                    </div>
                );
            default:
                return 'Made With <3 By Elbert Cheng & Alan Wen';
        }
    }
    
    // const getTimer = () => {
    //     switch (gameState) {
    //         case GameStates.LOBBY:
    //             return <LobbyTimer 
    //                 footerTimeOutCallback={footerTimeOutCallback}
    //                 lobbyPlayers={lobbyPlayers}
    //                 lobbyReadyStatus={lobbyReadyStatus}
    //             />;
    //         case GameStates.REVIEW:
    //             return <ReviewTimer

    //             />;
    //         default:
    //             return 'Made With <3 By Elbert Cheng & Alan Wen';
    //     }
    // }

    return (
        <footer>
            <span id='player-status'>{getFooter()}</span>
        </footer>
    )
}

function LobbyTimer(props) {
    const timer = useTimer({
        initialTime: 5,
        timerType: 'DECREMENTAL',
        endTime: 0
        // onTimeOver: footerTimeOutCallback(GameStates.LOBBY)  -   @TODO: make better after MVP
    });

    useEffect(() => {
        // Handle time counters
        SocketService.startGameListener(timer.start);
        SocketService.stopCountDownListener(timer.reset);
    }, []);

    return convertSecondsToTime(timer.time);
}

function ReviewTimer(props) {
    const timer = useTimer({
        initialTime: 5,
        timerType: 'DECREMENTAL',
        endTime: 0
        // onTimeOver: footerTimeOutCallback(GameStates.LOBBY)  -   @TODO: make better after MVP
    });

    useEffect(() => {
        // Handle time counters
        SocketService.startGameListener(timer.start);
        SocketService.stopCountDownListener(timer.reset);
    }, []);

    return convertSecondsToTime(timer.time);
}

function DiscussionTimer(props) {
    const timer = useTimer({
        initialTime: 5,
        timerType: 'DECREMENTAL',
        endTime: 0
        // onTimeOver: footerTimeOutCallback(GameStates.LOBBY)  -   @TODO: make better after MVP
    });

    useEffect(() => {
        // Handle time counters
        SocketService.startGameListener(timer.start);
        SocketService.stopCountDownListener(timer.reset);
    }, []);

    return convertSecondsToTime(timer.time);
}

// function ReviewTimer(props) {
//     const { time, start, pause, reset, status } = useTimer({
//         initialTime: 600,
//         timerType: 'DECREMENTAL',
//         endTime: 0
//         // onTimeOver: footerTimeOutCallback(GameStates.LOBBY)  -   @TODO: make better after MVP
//     });

//     useEffect(() => {
//         // Handle timeout counters
//         TimerService.startReviewTimerListener(start);
//         // SocketService.startGameListener(start);
//         // SocketService.stopCountDownListener(reset);
//     }, []);

//     return convertSecondsToTime(time);
// }

function ReadyCount(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const lobbyReadyStatus = props.lobbyReadyStatus;

    return `${lobbyReadyStatus.count}/${lobbyPlayers.length} Players Ready`;
}

// function LobbyFooter(props) {
//     const footerTimeOutCallback = props.footerTimeOutCallback;
//     const lobbyPlayers = props.lobbyPlayers;
//     const lobbyReadyStatus = props.lobbyReadyStatus;
//     const { time, start, pause, reset, status } = useTimer({
//         initialTime: 5,
//         timerType: 'DECREMENTAL',
//         endTime: 0,
//         onTimeOver: footerTimeOutCallback(GameStates.LOBBY)
//     });

//     useEffect(() => {
//         // Handle time counters
//         SocketService.startGameListener(start);
//         SocketService.stopCountDownListener(reset);
//     }, []);

//     // @TODO: alan plz beautify this
//     return (
//         <div>
//             {`${convertSecondsToTime(time)} : ${lobbyReadyStatus.count}/${lobbyPlayers.length}`}
//         </div>
//     );
// }

// function ReviewTimer(props) {
//     const { time, start, pause, reset, status } = useTimer({
//         initialTime: 5,
//         timerType: 'DECREMENTAL',
//         endTime: 0,
//         onTimeOver: footerTimeOutCallback(GameStates.LOBBY)
//     });

//     useEffect(() => {
//         // Handle time counters
//         SocketService.startGameListener(start);
//         SocketService.stopCountDownListener(reset);
//     }, []);

//     return (
//         <div>
//             {convertSecondsToTime(time)}
//         </div>
//     )
// }

const convertSecondsToTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`
    }

    return `${minutes}:${seconds}`
}

export default Footer;