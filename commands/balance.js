const {SlashCommandBuilder} = require("discord.js");
//const { execute } = require("../events/ready");

module.exports ={
    data: new SlashCommandBuilder().setName("balance").setDescription("Checks player balance"),
    async execute(interaction, profileData){
        const {balance} = profileData;
        const username = interaction.user.username;
        await interaction.reply(`${username} has $${balance}`);
    },
};