
const { SlashCommandBuilder } = require("discord.js");
const _ = require('lodash');
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports = {
    data: new SlashCommandBuilder().setName("draftorder").setDescription("Puts all drafting players into a random order"),
    async execute(interaction) {
        const user = interaction.user;

        var connection = createDatabaseConnection.createDatabaseConnection();

        try {
            // Query the database for users where drafting = 1
            connection.query('SELECT * FROM users WHERE drafting = 1', (err, results) => {
                if (err) {
                    console.error('Error fetching data from the database:', err);
                    interaction.reply('An error occurred while fetching data.');
                    return;
                }

                if (results.length === 0) {
                    interaction.reply('No users are currently drafting.');
                    return;
                }

                // Shuffle the results randomly using lodash
                const shuffledResults = _.shuffle(results);

                // Format the results into a message string, line by line
                let messageContent = 'List of users drafting:\n';
                shuffledResults.forEach((user, index) => {
                    messageContent += `${index + 1}. <@${user.userID}>\n`; // Adjust based on the actual column name
                });

                // Send the shuffled list as a message
                interaction.reply(messageContent);
            });
        } catch (error) {
            console.error('Error:', error);
            interaction.reply('An unexpected error occurred.');
        }
    },
};