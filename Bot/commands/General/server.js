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
    name: "server",
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
            const verificationLevels = {
                NONE: "0",
                LOW: "1",
                MEDIUM: "2",
                HIGH: "3",
                VERY_HIGH: "4",
              };
              let on =
                message.guild.presences.cache.filter((e) => e.status == "online")
                  .size - 1 || 0;
              let idle =
                message.guild.presences.cache.filter((e) => e.status == "idle").size +
                  1 || 0;
              let dnd =
                message.guild.presences.cache.filter((e) => e.status == "dnd").size ||
                0;
              var embed = new EmbedBuilder()
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .addFields([
                  {
                    name: `:id: Server ID: `,
                    value: `**${message.guild.id}**`,
                  },
                  {
                    name: `:date: Created On: `,
                    value: `**<t:${parseInt(message.guild.createdAt / 1000)}:R>**`,
                  },
                  {
                    name: `:crown: Owned by: `,
                    value: `**${await message.guild.fetchOwner()}**`,
                  },
                  {
                    name: `:busts_in_silhouette: Members: (**${message.guild.memberCount}**)`,
                    value: `**${Math.floor(on + idle + dnd)}** **Online \n${
                      message.guild.premiumSubscriptionCount
                    } Boosts :sparkles:**`,
                  },
                  {
                    name: `:speech_balloon: Channels: (${message.guild.channels.cache.size})`,
                    value: `**${
                      message.guild.channels.cache.filter(
                        (m) => m.type === "GUILD_TEXT"
                      ).size
                    }** **Text | ${
                      message.guild.channels.cache.filter(
                        (m) => m.type === "GUILD_VOICE"
                      ).size
                    } Voice**`,
                  },
                  {
                    name: `🌟 Roles:(${message.guild.roles.cache.size})`,
                    value: `**More roles info use [prefix]roles**`,
                  },
                ])
                .setColor(message.member.displayColor)
                .setAuthor({name:`${message.guild.name}`,iconURL: message.guild.iconURL()});
              message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};