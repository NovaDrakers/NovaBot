const { Events, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require("discord.js");
const fs = require("node:fs");
 
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
            for(const line of fs.readdirSync("lines")){
                var temp = fs.readFileSync("lines/" + line).toString();
                var tempArray = temp.split(`\n`);

                var Player1 = tempArray[0];
                var Player2 = tempArray[2];

                var Option1 = await interaction.guild.members.fetch(Player1);
                var Option2 = await interaction.guild.members.fetch(Player2);

                const modal = new ModalBuilder()
			        .setCustomId('gamblepopup')
			        .setTitle('Gamble GUI');

                const playerwageredon = new TextInputBuilder()
                    .setCustomId('playerwageredon')
                    .setStyle(TextInputStyle.Short)
                    .setLabel("DO NOT EDIT THIS VALUE!")

                const wagerAmount = new TextInputBuilder()
                    .setCustomId('wagerAmount')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue(`100`);
                
                if (interaction.customId == Player1 || interaction.customId == Player2){
                    if (interaction.customId == Player1){
                        wagerAmount.setLabel(`Wager how much on ${Option1.user.globalName}?`);
                        playerwageredon.setValue(`${Option1.user.id}`);
                    }
    
                    if (interaction.customId == Player2){
                        wagerAmount.setLabel(`Wager how much on ${Option2.user.globalName}?`)
                        playerwageredon.setValue(`${Option2.user.id}`)
                    }

                    const firstRow = new ActionRowBuilder().addComponents(wagerAmount);
                    const secondRow = new ActionRowBuilder().addComponents(playerwageredon);
    
                    modal.addComponents(firstRow, secondRow);
    
                    await interaction.showModal(modal);
                }
            }
        }

        if (interaction.isModalSubmit()) {
            const playerwageredon = interaction.fields.getTextInputValue('playerwageredon');
            const playerWagering = interaction.member.user;
            const wagerAmount = interaction.fields.getTextInputValue('wagerAmount');

            for(const line of fs.readdirSync("lines")){
                var temp = fs.readFileSync("lines/" + line).toString();
                var tempArray = temp.split(`\n`);

                var Player1 = tempArray[0];
                var Player2 = tempArray[2];

                var Option1 = await interaction.guild.members.fetch(Player1);
                var Option2 = await interaction.guild.members.fetch(Player2);

                if(playerwageredon == Player1){
                    tempArray[1] = (parseInt(wagerAmount) + parseInt(tempArray[1])).toString();
                    

                    tempArray.push(`${playerWagering.id}->${wagerAmount}`);

                    let writer = fs.createWriteStream("lines/" + line);

                    for(const i of tempArray){
                        writer.write(`${i}\n`);
                    }

                    break;
                }

                if(playerwageredon == Player2){
                    tempArray[3] = (parseInt(wagerAmount) + parseInt(tempArray[3])).toString();

                    tempArray.push(`${playerWagering.id}->${wagerAmount}`);

                    let writer = fs.createWriteStream("lines/" + line);

                    for(const i of tempArray){
                        writer.write(`${i}\n`);
                    }

                    break;
                }
            }

            var wagerUser = await interaction.guild.members.fetch(playerwageredon);

            await interaction.reply(`${playerWagering} wagered ${wagerAmount} on ${wagerUser.user}`);
        }
    },
};