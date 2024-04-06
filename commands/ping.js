const {SlashCommandBuilder} = require("discord.js");
//const { execute } = require("../events/ready");

module.exports ={
    data: new SlashCommandBuilder().setName("ping").setDescription("pong!"),
    async execute(interaction){
        await interaction.reply("pong");
    },
};