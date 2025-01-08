const {
    Client,
    Collection,
    Discord,
    createInvite,
    ChannelType,
    WebhookClient,
    PermissionFlagsBits,
    GatewayIntentBits,
    Partials,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    Events,
    Message,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    GatewayCloseCodes,
    ButtonStyle,
    PermissionOverwriteManager,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    name: "roles",
    type: "General",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            let roles = "```js\n";
            let names = message.guild.roles.cache.map((role) => `${role.name}`);
            let longest = names.reduce(
              (long, str) => Math.max(long, str.length),
              0
            );
            message.guild.roles.cache.forEach((role) => {
              roles += `${role.name}${" ".repeat(longest - role.name.length)} : ${
                role.members.size
              } members\n`;
            });
        
            roles += "```";
        
            message.reply({
              content: roles,
              allowedMentions: { repliedUser: false },
            });
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};