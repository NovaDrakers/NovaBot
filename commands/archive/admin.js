const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
//const { execute } = require("../events/ready");
const profileModel = require("../models/profiles.js");

module.exports ={
    data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("All Admin level commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
        subcommand.setName("add")
        .setDescription("Increment player balance")
        .addUserOption((option)=>
            option.setName("user")
            .setDescription("The user to add coins to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("amount")
            .setDescription("How much to give")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("subtract")
        .setDescription("Decrement player balance")
        .addUserOption((option)=>
            option.setName("user")
            .setDescription("The user to remove coins from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("amount")
            .setDescription("How much to remove")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    ,
    async execute(interaction){
        await interaction.deferReply();

        const adminSubcommand = interaction.options.getSubcommand();

        if(adminSubcommand === "add"){
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");
            
            await profileModel.findOneAndUpdate({
                userID: user.id,
            },
            {
                $inc:{
                    balance:amount,
                }
            });

            await interaction.editReply(
                `Added $${amount} to ${user.username}'s balance`
            )
        }

        if(adminSubcommand === "subtract"){
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");
            
            await profileModel.findOneAndUpdate({
                userID: user.id,
            },
            {
                $dec:{
                    balance:amount,
                }
            });

            await interaction.editReply(
                `Removed $${amount} from ${user.username}'s balance`
            )
        }
    },
};