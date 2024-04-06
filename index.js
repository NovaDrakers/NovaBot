require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const mongoose = require("mongoose");

const {DISCORD_TOKEN: token, MONGODB_SRV: database} = process.env;

const{Client, GatewayIntentBits, Collection  } = require("discord.js");
//const { execute } = require("./events/ready");

const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

var coolVar = '123-abc-itchy-knee';
var partsArray = coolVar.split('-');

for (var i of partsArray){
    console.log(i);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file)=>file.endsWith(".js"));

for(const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file)=>file.endsWith(".js"));

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command){
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required data or execute`);
    }

}

mongoose.connect(database, {
    useNewURLParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

client.login(token);