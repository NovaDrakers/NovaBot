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

            var reply = `<@${tempArray[0]}> vs <@${tempArray[1]}>\n`;

            var Option1 = await interaction.guild.members.fetch(tempArray[0]);
            var Option2 = await interaction.guild.members.fetch(tempArray[1]);

            const Button1 = new ButtonBuilder()
			.setCustomId(`${tempArray[0]}`)
			.setLabel(`${Option1.user.globalName}`)
			.setStyle(ButtonStyle.Success);

            const Button2 = new ButtonBuilder()
			.setCustomId(`${tempArray[1]}`)
			.setLabel(`${Option2.user.globalName}`)
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