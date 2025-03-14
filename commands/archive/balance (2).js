const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("balance").setDescription("Checks player balance"),
    async execute(interaction) {
        const user = interaction.user;

        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            port: '3306',
            user: 'VSCode',
            password: 'VSCode123456',
            database: 'draftdiscordbot'
        });

        connection.connect();

        connection.query(`select * from users where userID = ${interaction.user.id}`, function (error, results, fields) {
            if (error) throw error;

            if (results.length != 0) {
                const balance = results[0].balance;
                interaction.reply(`${user} has $${balance}`);
            } else interaction.reply(`There is no user for ${user}. Please run the command /createUser`);

        });
    },
};
