const {SlashCommandBuilder, PermissionFlagsBits} = require("discord.js");
const fs = require("node:fs");

module.exports = {
    data: new SlashCommandBuilder()
	.setName('createline')
	.setDescription('Creates a standard gamble line')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addUserOption(option =>
		option.setName('option1')
		.setDescription('Option 1 of the Moneyline')
		.setRequired(true)
    )
    .addUserOption(option =>
		option.setName('option2')
		.setDescription('Option 2 of the Moneyline')
		.setRequired(true)
    ),
    async execute(interaction){

        const Option1 = interaction.options.getUser('option1');
        const Option2 = interaction.options.getUser('option2');
        
        if (!fs.existsSync("lines")){
            fs.mkdirSync("lines");
        }

        const FileName = ("lines/" + Option1 + " vs " + Option2).toString();

        for(const line of fs.readdirSync("lines")){
            var temp = fs.readFileSync("lines/" + line).toString();
            var tempArray = temp.split(`\n`);

            if(Option1== tempArray[0] || Option2 == tempArray[0] || Option1 == tempArray[2] || Option2 == tempArray[2])
            {
                await interaction.reply("One of these players are already in a previous bet");
                return;
            }
        }

        if (!fs.existsSync(FileName)){
            fs.writeFileSync(FileName, Option1 + "\n100\n" + Option2 + "\n100" );
            await interaction.reply(`Betline ${Option1} vs ${Option2} was created`);
        } else {
            await interaction.reply(`Betline already exists`);
        }
    },
};