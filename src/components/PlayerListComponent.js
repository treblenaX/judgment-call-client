import { useEffect, useState } from "react";

export default function PlayerListComponent(props) {
    const lobbyPlayers = props.lobbyPlayers;

    return (
        <div>
            <h1>Players in Lobby:</h1>
            <div>
                { createPlayerCards(lobbyPlayers) }
            </div>
        </div>
    );
}
/** Private helper functions */
function createPlayerCards(players) {

    return players.map((player) => {
        return (
            <div key={player.id}>
                <h2>
                    { player.playerName }
                </h2>
            </div>
        )
    });
}