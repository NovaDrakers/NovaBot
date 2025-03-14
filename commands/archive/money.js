const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client} = require("discord.js");

module.exports ={
    data: new SlashCommandBuilder().setName("money").setDescription("Grant $1000"),
    async execute(interaction){
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
                connection.query(`UPDATE users SET balance = ${results[0].balance + 1000} WHERE(userID = ${interaction.user.id});`);
                interaction.reply(`<@${interaction.user.id}> gained $1000`);
            } else interaction.reply(`There is no user for ${user}. Please run the command /createUser`);
        });
    },
};