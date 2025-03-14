const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

const profileModel = require("../models/profiles.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("pay another player")
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user to pay")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("amount")
                .setDescription("How much to pay")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        var connection = createDatabaseConnection.createDatabaseConnection();

        connection.query(`SELECT * FROM users WHERE userID =  ${interaction.user.id}`, function (error, results) {
            let giverBalance = results[0].balance;
            if (giverBalance < amount) {
                interaction.reply(`You do not have enough to pay this user`)
            } else {
                connection.query(`SELECT * FROM users WHERE userID =  ${user.id}`, function (error, results) {
                    let givenBalance = results[0].balance;
                    connection.query(`UPDATE users SET balance = ${giverBalance - amount} WHERE(userID = ${interaction.user.id});`);
                    connection.query(`UPDATE users SET balance = ${givenBalance + amount} WHERE(userID = ${user.id});`);
                    interaction.reply(`You have paid ${user} $${amount}`);
                });

            }

        });
    },
};
