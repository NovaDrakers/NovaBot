const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("resolvebet").setDescription("Resolves an ongoing bet")
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user who won their bet")
                .setRequired(true)
        ).addStringOption((option) =>
            option.setName("points")
                .setDescription("How many points the user won")
                .setRequired(true)
        ).addStringOption((option) =>
            option.setName("replay_link")
                .setDescription("The link to the battle")
                .setRequired(true)
        ),
    async execute(interaction){
        var connection = createDatabaseConnection.createDatabaseConnection();

        const inputtedUser = interaction.options.getUser("user");
        const ReplayLink = interaction.options.getString("replay_link");
        const pointsWon = interaction.options.getString("points");


        connection.query(`select * from bet_lines WHERE active = 1 AND (user1 = ${inputtedUser.id} OR user2 = ${inputtedUser.id})`, function (error, results, fields) {
            if (error) throw error;

            if (results.length != 0) {
                const betID = results[0].wagerID;

                connection.query(`UPDATE bet_lines SET active = 0, replay_link = "${ReplayLink}" WHERE(wagerID = ${betID});`);
                connection.query(`UPDATE users SET points = points + ${pointsWon} WHERE (userID = ${inputtedUser.id})`);

                connection.query(`SELECT userID, SUM(totalReturn) AS total_bet FROM bets WHERE paid = 0 and wagerID = ${betID} and protag = ${inputtedUser.id} GROUP BY userID;`, function (error, results, fields) {
                    if (error) throw error;

                    if (results.length != 0) {
                        var content = `Below!`;

                        for (const record of results) {
                            connection.query(`UPDATE users SET balance = balance + ${record.total_bet} WHERE userID = ${record.userID} ;`);
                            content = content.concat(`\n<@${record.userID}> has won $${record.total_bet}`);
                        }

                        interaction.reply(content);
                    } else {
                        interaction.reply("No one thought he could do it, did you");
                    }
                    connection.query(`UPDATE bets SET paid = 1 WHERE(paid = 0 AND wagerID = ${betID});`);
                    
                });
            } else {
                interaction.reply("This user has no active bet");
            }
        });
    },
};