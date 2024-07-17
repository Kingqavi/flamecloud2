exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.find((r) => r.id === "1250045509868195840")) return;

    let userid =
        args[1] == null
            ? message.author.id
            : args[1].match(/[0-9]{17,19}/).length == 0
            ? args[1]
            : args[1].match(/[0-9]{17,19}/)[0];

    if (args[1] == null) {
        message.reply("Please send a users discord ID to see if they are linked with an account on the host.");
    } else {
        if (userData.get(userid) == null) {
            message.reply("That account is not linked with a console account :sad:");
        } else {
            //console.log(userData.fetch(userid));

            let embed = new Discord.MessageEmbed()
                .setColor(`GREEN`)
                .addField(`__**Username**__`, userData.fetch(args[1] + ".username"))
                .addField(`__**Email**__`, userData.fetch(args[1] + ".email"))
                .addField(`__**Discord ID**__`, userData.fetch(args[1] + ".discordID"))
                .addField(`__**Console ID**__`, userData.fetch(args[1] + ".consoleID"))
                .addField(`__**Date (YYYY/MM/DD)**__`, userData.fetch(args[1] + ".linkDate"))
                .addField(`__**Time**__`, userData.fetch(args[1] + ".linkTime"));
            await message.reply("That account is linked. Heres some data: ", embed);
        }
    }
};
