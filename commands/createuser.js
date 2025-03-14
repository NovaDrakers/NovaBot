const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("createuser").setDescription("Creates User")
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user to create account for")
                .setRequired(false)
        ),
    async execute(interaction){

        var connection = createDatabaseConnection.createDatabaseConnection();

        var user = interaction.user;;

        if (interaction.options.getUser("user") != null) {
            user = interaction.options.getUser("user");
        }

        connection.query(`select * from users where userID = ${user.id}`, function (error, results, fields) {
            if (error) throw error;

            if (results.length == 0) {
                connection.query(`INSERT INTO users (userID, balance, wager_value) VALUES (${user.id}, 1000, 1000)`);
                interaction.reply(`User created for ${user}`);
            } else interaction.reply(`${user} already has a user`);
        });
    },
};