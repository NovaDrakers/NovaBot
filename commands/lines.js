const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("lines").setDescription("Display all Player Lines"),
    async execute(interaction){
        const components = [];

        var connection = createDatabaseConnection.createDatabaseConnection();
        
        connection.query(`SELECT * FROM bet_lines WHERE active = 1`, function (error, results) {
            if (error) throw error;
            var bet_lines = results;

            connection.query(`SELECT * FROM users`, function (error, results) {
                if (error) throw error;

                var content = `Below are all the available bets:`;

                for (const bet_record of bet_lines) {

                    let wager1 = 0;
                    let wager2 = 0;

                    for (const result_record of results) {
                        if (bet_record.user1 == result_record.userID) wager1 = result_record.wager_value
                        if (bet_record.user2 == result_record.userID) wager2 = result_record.wager_value
                    }

                    let odds1 = (wager2 / wager1).toFixed(2);
                    let odds2 = (wager1 / wager2).toFixed(2);

                    content = content.concat(`\n<@${bet_record.user1}> ${odds1} vs <@${bet_record.user2}> ${odds2}`);
                }

                content = content.concat(`\nType "/wager user amount" in order to wager on your desired winner`);
                interaction.reply(content);
            });
        });

        

    },
};