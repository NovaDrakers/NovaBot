const { Events } = require("discord.js");
 
const profileModel = require("../models/profileSchema.js");

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()){
            let profileData;
        try{
            profileData = await profileModel.findOne({userID: interaction.user.id});
            if (!profileData){
                profileData = await profileModel.create({
                    userID: interaction.user.id
                });
            }
        } catch(err){
            console.log(err);
        }


        const command = interaction.client.commands.get(interaction.commandName);
 
        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }
 
        try {
            await command.execute(interaction, profileData);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
        };
        if(interaction.isButton()){
            if(interaction.customId == `Button1`){
                interaction.reply("Clicked Button 1");
            }
            if(interaction.customId == `Button2`){
                interaction.reply("Clicked Button 2");
            }
        }
    },
};