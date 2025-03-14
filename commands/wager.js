const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createDatabaseConnection = require('../funtions/DBConnection.js');

const profileModel = require("../models/profiles.js");

module.exports ={
    data: new SlashCommandBuilder()
    .setName("wager")
    .setDescription("Wager on Bets")
        .addUserOption((option) =>
            option.setName("user")
                .setDescription("The user to wager on")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("amount")
                .setDescription("How much to wager")
                .setRequired(true)
                .setMinValue(1)
    ),
    async execute(interaction){
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        var connection = createDatabaseConnection.createDatabaseConnection();

        connection.query(`SELECT * FROM users WHERE userID =  ${interaction.user.id}`, function (error, results) {
            let balance = results[0].balance;
            if (balance < amount) {
                interaction.reply(`You do not have enough to place this wager`)
            } else {
                connection.query(`SELECT wager_value FROM users WHERE userID = ${user.id}`, function (error, results) {
                    if (error) throw error;

                    oldProtagWager = results[0].wager_value;

                    connection.query(`SELECT * FROM bet_lines WHERE active = 1 AND (user1 = ${user.id} OR user2 = ${user.id})`, function (error, results) {
                        if (error) throw error;

                        if (results.length != 0) {
                            let oldProtagWager = 0;
                            let AntagWager = 0;

                            if (user.id == results[0].user1) {
                                oldProtagWager = results[0].wager1;
                                AntagWager = results[0].wager2;

                                connection.query(`UPDATE bet_lines SET wager1 = ${oldProtagWager + amount} WHERE(user1 = ${user.id}) AND active = 1`);
                            } else if (user.id == results[0].user2) {
                                oldProtagWager = results[0].wager2;
                                AntagWager = results[0].wager1;

                                connection.query(`UPDATE bet_lines SET wager2 = ${oldProtagWager + amount} WHERE(user2 = ${user.id}) AND active = 1`);
                            }

                            let odds = AntagWager / oldProtagWager;
                            let winnings = ((amount * odds) + amount).toFixed(2);



                            connection.query(`UPDATE users SET wager_value = ${oldProtagWager + amount} WHERE(userID = ${user.id});`);

                            connection.query(`INSERT INTO bets (userID, wager, totalReturn, wagerID, protag) VALUES (${interaction.user.id}, ${amount}, ${winnings}, ${results[0].wagerID}, ${user.id});`);
                            connection.query(`UPDATE users SET balance = ${balance - amount} WHERE(userID = ${interaction.user.id});`);

                            interaction.reply(
                                `You have wagered $${amount} on <@${user.id}> for a potential return of $${winnings}`
                            )
                        } else {
                            interaction.reply(
                                `This user does not have a active bet. type /lines for a list of active bets\nIf this user should have an active bet, have an admin run /createline for said user`
                            )
                        }

                        
                    });
                });
            }

        });
    },
};