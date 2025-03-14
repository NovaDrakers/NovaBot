const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
	.setName('createline')
	.setDescription('Creates a standard gamble line')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addUserOption(option =>
		option.setName('option1')
		.setDescription('Option 1 of the Moneyline')
		.setRequired(true)
    )
    .addUserOption(option =>
		option.setName('option2')
		.setDescription('Option 2 of the Moneyline')
		.setRequired(true)
    ),
    async execute(interaction){

        var connection = createDatabaseConnection.createDatabaseConnection();

        const Option1 = interaction.options.getUser('option1');
        const Option2 = interaction.options.getUser('option2');

        var wager1;
        var wager2;

        if (Option1 != Option2) {
            connection.query(`SELECT * FROM bet_lines WHERE active = 1 AND (user1 = ${Option1.id} or user2 = ${Option1.id} or user1 = ${Option2.id} or user2 = ${Option2.id})`, function (error, results) {
                if (results.length == 0) {
                    connection.query(`SELECT * FROM users where userID = ${Option1.id}`, function (errror, results) {

                        wager1 = results[0].wager_value;
                        connection.query(`SELECT * FROM users where userID = ${Option2.id}`, function (errror, results) {

                            wager2 = results[0].wager_value;
                            connection.query(`INSERT INTO bet_lines (user1, wager1, user2, wager2) VALUES (${Option1.id}, ${wager1}, ${Option2.id}, ${wager2})`);
                        });
                    });
                    interaction.reply(`Line created for ${Option1} vs ${Option2}`);
                } else {
                    interaction.reply(`One of these users are already in an active bet`);
                }
            })
        } else {
            interaction.reply(`You cannot make a line against the same users`);
        }

        
    },
};