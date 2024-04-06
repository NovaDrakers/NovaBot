const {SlashCommandBuilder} = require("discord.js");
//const { execute } = require("../events/ready");

module.exports ={
    data: new SlashCommandBuilder().setName("balance").setDescription("Checks player balance"),
    async execute(interaction, profileData){
        const {balance} = profileData;
        const user = interaction.user;
        await interaction.reply(`${user} has $${balance}`);
    },
};