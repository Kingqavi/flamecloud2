const cap = require("../util/cap");

module.exports = async (client, message) => {
    // Suggestions channels reactions
    const suggestionChannels = [
        "980595293768802327", // Staff Suggestions
        "976371313901965373" // VPN Suggestions
    ];

    if (suggestionChannels.some(channel => channel == message.channel.id)) {
        if (!message.content.startsWith(">")) {
            await message.react("👍");
            await message.react("👎");
        }
    }

    // Handles direct messages
    const dmAllowedUsers = [
        "569352110991343616", // Tara
        "1131236182899052696", // Sky
        "871722786006138960", // Cyteon
        "1080213687073251461" // Snowy
    ];

    if (message.channel.type === "dm") {
        // Allow users to send messages on behalf of the bot if they are allowed
        if (dmAllowedUsers.includes(message.author.id)) {
            const args = message.content.trim().split(/ +/g);

            try {
                const msg = await client.channels.cache.get(args[0]).send(cap(message.content.split(" ").slice(1).join(" "), 2000));
                message.reply(msg.url);
            } catch(err) {
                message.channel.send(`\`\`\`${err.message}\`\`\``);
            }
        };
    };

    if (message.author.bot) return; // Stop bots from running commands
    if (message.channel.type === "dm") return; // Stop commands in DMs

    const prefix = config.DiscordBot.Prefix;
    if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandargs = message.content.split(" ").slice(1).join(" ");
    const command = args.shift().toLowerCase();

    console.log(
        chalk.magenta("[DISCORD] ") +
            chalk.yellow(`[${message.author.username}] [${message.author.id}] >> ${prefix}${command} ${commandargs}`)
    );

    let actualExecutorId;

    try {
        let blacklisted = [
            "898041849783148585", // lounge
        ];

        // Channel checker
        if (
            blacklisted.includes(message.channel.id) &&
            !message.member.roles.cache.find((x) => x.id === "898041751099539497") &&
            !message.member.roles.cache.find((x) => x.id === "898041743566594049")
        ) return;

        if (
            command === "server" ||
            command === "user" ||
            command === "staff" ||
            command === "ticket"
        ) {
            // Cooldown setting
            if (!args[0]) {
                let commandFile = require(`../commands/${command}/help.js`);
                await commandFile.run(client, message, args);
            } else {
                let commandFile = require(`../commands/${command}/${args[0]}.js`);
                await commandFile.run(client, message, args);
            }
        } else {
            let commandFile = require(`../commands/${command}.js`);
            await commandFile.run(client, message, args);
        }
    } catch (Error) {
        if (!Error.message.startsWith("Cannot find module")) {
            console.log("Error loading module:", Error);
        }
    }
};