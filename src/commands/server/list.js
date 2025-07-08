const Axios = require("axios");
const Discord = require("discord.js");

const Config = require('../../../config.json');

exports.description = "Shows the servers a user has.";

/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {Array} args 
 * @returns void
 */
exports.run = async (client, message, args) => {
    let user = message.author;
    let userID = message.author.id;

    if (message.member.roles.cache.find((r) => r.id === Config.DiscordBot.Roles.BotAdmin))
        userID = args[1] || message.author.id;

    const userAccount = await userData.get(userID);

    if (userAccount == null || userAccount.consoleID == null) {
        if (userID === message.author.id) {
            return message.reply(
                `You do not have a panel account linked, please create or link an account.\n\`${Config.DiscordBot.Prefix}user new\` - Create an account\n\`${Config.DiscordBot.Prefix}user link\` - Link an account`,
            );
        } else {
            return message.reply("That user does not have a panel account linked.");
        }
    }

    if (userID !== message.author.id) {
        user = client.users.cache.get(userID);
    }

    var arr = [];

    try {
        const response = await Axios({
            url: `${Config.Pterodactyl.hosturl}/api/application/servers?per_page=99999999`,
            method: "GET",
            maxRedirects: 5,
            headers: {
                Authorization: `Bearer ${Config.Pterodactyl.apikey}`,
                "Content-Type": "application/json",
                Accept: "Application/vnd.pterodactyl.v1+json",
            },
        });

        const servers = response.data.data;
    
        servers.forEach(server => {
            if (server.attributes.user === userAccount.consoleID) {
                arr.push(server);
            }
        });
    
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        return message.reply("An error occurred while loading servers. Please try again later.");
    }

    const format = (server) =>
        arr.length > 20
            ? `\`${server.attributes.identifier}\``
            : `**${server.attributes.name}** (ID: \`${server.attributes.identifier}\`)`;

    const freeServers = arr.map(format);

    if (arr.length === 0) {
        message.reply(
            `${userID === message.author.id ? "You do" : "That user does"} not have any servers.`
        );
    } else {
        let embedContent = ``;

        if (freeServers.length > 0)
            embedContent += `**Servers: (${freeServers.length})**\n${freeServers.join("\n")}\n\n`

        if (embedContent.length > 4096) {
            const fileContent = `${embedContent}`.replace(/\*\*|\n\n/g, "");
            const attachment = new Discord.AttachmentBuilder(Buffer.from(fileContent), {
                name: "server_list.txt",
            });

            await message.reply({
                content: `${userID === message.author.id ? "Your" : "Their"} server list exceeds Discord's character limit. Here is the list:`,
                files: [attachment],
            });
        } else {
            const serverListEmbed = new Discord.EmbedBuilder()
                .setTitle(`Server List (${arr.length})`)
                .setColor('Blue')
                .setDescription(embedContent)
                .setTimestamp()
                .setFooter({ text: "Command Executed By: " + message.author.username + ` (${message.author.id})`, iconURL: message.author.avatarURL() });

            if (userID !== message.author.id) {
                serverListEmbed.setAuthor({
                    name: user.tag,
                    iconURL: user.displayAvatarURL({ format: "png", dynamic: true }),
                    url: `https://discord.com/users/${user.id}`,
                });
            }

            await message.reply({ embeds: [serverListEmbed] });
        }
    }
};