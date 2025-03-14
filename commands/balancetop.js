const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("balancetop").setDescription("Display all Player Balances"),
    async execute(interaction){
        const components = [];

        var connection = createDatabaseConnection.createDatabaseConnection();
        
        connection.query(`SELECT * FROM users ORDER BY balance desc`, function (error, results) {
            if (error) throw error;
            var users = results;
            var content = `Below are all the player balances:`;
            for (const user of results) {
                    content = content.concat(`\n<@${user.userID}> has $${user.balance}`);
            }

            interaction.reply(content);
        });
    },
};