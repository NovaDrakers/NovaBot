const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("prep").setDescription("Returns the pred Document"),
    async execute(interaction){
        await interaction.reply("Make a Copy asap. It takes a while to load\nhttps://docs.google.com/spreadsheets/d/1VTps7_lVVd5WpPVpiPt2GlKHy9CCIjMcsJVio4lnANI/edit?gid=442127394#gid=442127394");
    },
};