const { SlashCommandBuilder } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

module.exports ={
    data: new SlashCommandBuilder().setName("calc").setDescription("Returns the live Damage Calculator"),
    async execute(interaction){
        await interaction.reply("https://chromewebstore.google.com/detail/showdex/dabpnahpcemkfbgfbmegmncjllieilai");
    },
};