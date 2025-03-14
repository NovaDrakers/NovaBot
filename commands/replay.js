const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
	.setName('replay')
	.setDescription('Finds replay of two players')
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
            connection.query(`SELECT * FROM bet_lines WHERE active = 0 AND replay_link iS NOT NULL AND (user1 = ${Option1.id} or user2 = ${Option1.id} or user1 = ${Option2.id} or user2 = ${Option2.id})`, function (error, results) {
                if (results.length == 0) {
                    interaction.reply(`This bet does not exist, is still being played or does not have a replay set`);
                } else {
                    interaction.reply(results[0].replay_link);
                }

            })
        } else {
            interaction.reply(`You cannot view replays of the same user`);
        }

        
    },
};