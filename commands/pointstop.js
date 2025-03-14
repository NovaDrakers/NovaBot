const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("pointstop").setDescription("Display all Player Points"),
    async execute(interaction){
        const components = [];

        var connection = createDatabaseConnection.createDatabaseConnection();
        
        
        connection.query(`SELECT * FROM users where drafting = 1 ORDER BY points desc`, function (error, results) {
            if (error) throw error;
            var users = results;
            var content = `Below are all the player points:`;
            for (const user of results) {
                    content = content.concat(`\n<@${user.userID}> has ${user.points} points`);
            }

            interaction.reply(content);
        });
    },
};