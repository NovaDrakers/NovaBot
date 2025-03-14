const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("draft").setDescription("Returns the draft Document"),
    async execute(interaction){
        await interaction.reply("https://docs.google.com/spreadsheets/d/1wtqnzTPDUTiWnIRUzlIDT-w8KtdGkGR-Q0Aqvo9qwK4/edit?gid=381390363#gid=381390363");
    },
};