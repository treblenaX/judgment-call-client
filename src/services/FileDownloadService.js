export class FileDownloadService {
    static downloadFile(payload) {
        // Init variables
        const timestamp = payload.timestamp;
        const players = payload.players;
        const gameMaster = payload.gameMaster;
        const clientPlayer = payload.clientPlayer;
        // Create Headers
        var headers = 'Label,Content\n';

        // Parse the data to be ready for CSV files
        var information = [
            ['Client', clientPlayer.playerName],
            ['End Time', timestamp],
            ['Scenario', gameMaster.scenario.name, gameMaster.scenario.description],
            []
        ]

        // Parse the entire player data
        players.forEach(player => {
                const cards = player.cards;
                const data = player.data;
                information.push(['Player', player.playerName]);
                information.push(['Stakeholder', cards.stakeholder.name]);
                information.push(['Principle', cards.principle.name]);
                information.push(['Rating', cards.rating.name]);
                information.push(['Review', data.review]);
                information.push(['Discussion Benefits', ...data.discussion.benefits]);
                information.push(['Discussion Harms', ...data.discussion.harms]);
                information.push(['Discussion Themes', ...data.discussion.themes]);
                information.push(['Mitigation', data.mitigation]);
                information.push(['Judgment Call', data.judgment]);
                information.push([]);
        });

        // Merge the data
        information.forEach(row => {
            headers += row.join(',');
            headers += '\n';
        })

        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(headers);
        hiddenElement.target = '_blank';
        
        //provide the name for the CSV file to be downloaded
        hiddenElement.download = 'JudgmentCallRoundResults.csv';
        hiddenElement.click();
    }
}