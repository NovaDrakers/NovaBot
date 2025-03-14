const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports = {
    data: new SlashCommandBuilder().setName("checkpoints").setDescription("Checks player points").addUserOption((option) =>
        option.setName("user")
            .setDescription("The user who won their bet")
            .setRequired(false)
    ),
    async execute(interaction) {

        var user = interaction.user;

        if (interaction.options.getUser("user") != null) {
            user = interaction.options.getUser("user");
        }

        var connection = createDatabaseConnection.createDatabaseConnection();

        connection.query(`select * from users where userID = ${user.id}`, function (error, results, fields) {
            if (error) throw error;

            if (results.length != 0) {
                const points = results[0].points;
                interaction.reply(`${user} has ${points} points`);
            } else interaction.reply(`There is no user for ${user}. Please run the command /createUser`);

        });
    },
};
