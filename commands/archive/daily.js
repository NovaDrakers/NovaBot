const {SlashCommandBuilder} = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profiles.js");

const{dailyMin, dailyMax} = require("../globalValues.json");

module.exports ={
    data: new SlashCommandBuilder().setName("daily").setDescription("Recieve daily Money"),
    async execute(interaction, profileData){
        const {id} = interaction.user;
        const {dailyLastUsed} = profileData;

        const cooldown = 1000 * 60 * 60 * 24;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);

        if(timeLeft>0){
            await interaction.deferReply({ephemeral: true});
            const {hours, minutes, seconds} = parseMilliseconds(timeLeft);

            await interaction.editReply(`Claim your next daily in ${hours}:${minutes}:${seconds}`);
        }

        await interaction.deferReply();

        const randomAmt = Math.floor(Math.random() * (dailyMax - dailyMin + 1) + dailyMin);

        try{
            await profileModel.findOneAndUpdate(
                {userID: id},
                {
                    $set:{
                        dailyLastUsed: Date.now(),
                        

                    },
                    $inc:{
                        balance: randomAmt,
                    },
                }
            )
        } catch(err){
            console.log(err);
        }

        await interaction.editReply(`<@${id}> gained $${randomAmt}`);
    },
};