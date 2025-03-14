const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports = {
    data: new SlashCommandBuilder().setName("activebets").setDescription("Display all active bets"),
    async execute(interaction) {
        var connection = createDatabaseConnection.createDatabaseConnection();

        connection.query(`select * from bets WHERE paid = 0`, function (error, results, fields) {
            if (error) throw error;

            if (results.length != 0) {
                var content = `All active bets below!`;

                for (const record of results) {
                    content = content.concat(`\n<@${record.userID}> bet $${record.wager} on <@${record.protag}> for a potential return of $${record.totalReturn}`);
                }
                interaction.reply(content);
            } else {
                interaction.reply("There are no active bets!");
            }
        });
    },
};