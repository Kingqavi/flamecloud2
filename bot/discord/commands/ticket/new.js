const Discord = require("discord.js");

exports.run = async (client, message, args) => {
    let category = message.guild.channels.cache.find((c) => c.id === "1250790663662993579" && c.type === "category");
    if (!category) return;

    if (
        message.guild.channels.cache.find((ch) =>
            ch.name.includes(message.author.username.toLowerCase().replace(" ", "-"))
        )
    )
        return message.reply(`You already have an open ticket.`);

    let channel = await message.guild.channels
        .create(message.author.username + "-ticket", "text")

        .catch((err) => {
            console.log(err);
        });

    await channel.setParent(category.id).catch(console.error);

    setTimeout(() => {
        channel.updateOverwrite(message.guild.roles.everyone, {
            SEND_MESSAGES: false,
            VIEW_CHANNEL: false,
        });

        channel.updateOverwrite(message.author.id, {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        });

        channel.updateOverwrite("1250045509868195840", {
            SEND_MESSAGES: true,
            VIEW_CHANNEL: true,
            READ_MESSAGE_HISTORY: true,
        });
    }, 1000);

    message.reply(`A ticket has been opened for you, check it out here: ${channel}`);

    if (userData.get(message.author.id) == null) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
            .setDescription("Please do not ping staff, it will not solve your problem faster.")
            .addField(`📡 | Account Info`, `This account is not linked with a console account.`)
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();
        channel.send(`${message.author} <@&1250045509868195840>`, embed);
    } else {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${client.user.username} | Tickets`, client.user.avatarURL())
            .setDescription(`Please do not ping staff, it will not solve your problem faster.`)
            .addField(
                `📡 | Account Info`,
                `**Username:** ${userData.fetch(message.author.id + ".username")}\n**Email:** ||${userData.fetch(
                    message.author.id + ".email"
                )}||\n**Link Date:** ${userData.fetch(
                    message.author.id + ".linkDate"
                )}\n**Link Time:** ${userData.fetch(message.author.id + ".linkTime")}`
            )
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();
        channel.send(`${message.author} <@&1250045509868195840>`, embed);
    }
};