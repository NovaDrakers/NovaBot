const {SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Client} = require("discord.js");
const fs = require("node:fs");

module.exports ={
    data: new SlashCommandBuilder().setName("lines").setDescription("Display all Player Lines"),
    async execute(interaction){

        var LineGroups = [];

        const client = new Client({
            intents:[
        ],
    });

    const components = [];

        for(const line of fs.readdirSync("lines")){
            var temp = fs.readFileSync("lines/" + line).toString();
            var tempArray = temp.split(`\n`);

            var Player1 = tempArray[0];
            var Player2 = tempArray[2];

            var Option1 = await interaction.guild.members.fetch(Player1);
            var Option2 = await interaction.guild.members.fetch(Player2);

            const Button1 = new ButtonBuilder()
			.setCustomId(`${Player1}`)
			.setLabel(`${Option1.user.globalName} ${tempArray[1]}`)
			.setStyle(ButtonStyle.Success);

            const Button2 = new ButtonBuilder()
			.setCustomId(`${Player2}`)
			.setLabel(`${Option2.user.globalName} ${tempArray[3]}`)
			.setStyle(ButtonStyle.Success);

            const row = new ActionRowBuilder()
			.addComponents(Button1, Button2);

            components.push(row);
        }

        await interaction.reply({
            content: `Each Row is its own unique Line\nClick on the person you would like to bet on per line`,
            components: components,
        });

    },
};