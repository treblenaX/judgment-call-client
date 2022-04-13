import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react";
import { faSquareCheck as faEmptySquareCheck} from "@fortawesome/free-regular-svg-icons";

export default function PlayerListComponent(props) {
    const lobbyPlayers = props.lobbyPlayers;
    const clientReady = props.client.isReady;
    const client = props.client;


    return (
        <div>
            <h1>Players in Lobby:</h1>
            { createPlayerCards(lobbyPlayers, client, clientReady)}
        </div>
    );
}

function PlayerCardComponent(props) {
    const player = props.player;

    return (
        <div className="player-card-container" key={ player.id }>
            <h2 className="player-card-item">
                { player.playerName }
            </h2>
            <div className="player-card-item">
                { !player.readyState 
                    ?   <FontAwesomeIcon icon={ faEmptySquareCheck } />
                    :   <FontAwesomeIcon icon={ faSquareCheck } />  }
            </div>
        </div>
    )
}

/** Private helper functions */
function createPlayerCards(players, client, clientReady) {
    const cards = players.map((player) => <PlayerCardComponent player={ player } client={ client } clientReady={ clientReady } />);
    return (
        <div>
            { cards }
        </div>
    );
}