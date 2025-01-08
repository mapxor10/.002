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
    ChatInputCommandInteraction
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Display information about the server.')

    ,
    type: "General",
    botP: [],
    userP: [],
    P: ""
    ,
    support: false,
    ownerOnly: false,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    async run(client, interaction, language, reply, replyEmbeds, name) {
        try {
            const verificationLevels = {
                NONE: "0",
                LOW: "1",
                MEDIUM: "2",
                HIGH: "3",
                VERY_HIGH: "4",
            };
            let on =
                interaction.guild.presences.cache.filter((e) => e.status == "online")
                    .size - 1 || 0;
            let idle =
                interaction.guild.presences.cache.filter((e) => e.status == "idle").size +
                1 || 0;
            let dnd =
                interaction.guild.presences.cache.filter((e) => e.status == "dnd").size ||
                0;
            var embed = new EmbedBuilder()
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .addFields([
                    {
                        name: `:id: Server ID: `,
                        value: `**${interaction.guild.id}**`,
                    },
                    {
                        name: `:date: Created On: `,
                        value: `**<t:${parseInt(interaction.guild.createdAt / 1000)}:R>**`,
                    },
                    {
                        name: `:crown: Owned by: `,
                        value: `**${await interaction.guild.fetchOwner()}**`,
                    },
                    {
                        name: `:busts_in_silhouette: Members: (**${interaction.guild.memberCount}**)`,
                        value: `**${Math.floor(on + idle + dnd)}** **Online \n${interaction.guild.premiumSubscriptionCount
                            } Boosts :sparkles:**`,
                    },
                    {
                        name: `:speech_balloon: Channels: (${interaction.guild.channels.cache.size})`,
                        value: `**${interaction.guild.channels.cache.filter(
                            (m) => m.type === "GUILD_TEXT"
                        ).size
                            }** **Text | ${interaction.guild.channels.cache.filter(
                                (m) => m.type === "GUILD_VOICE"
                            ).size
                            } Voice**`,
                    },
                    {
                        name: `🌟 Roles:(${interaction.guild.roles.cache.size})`,
                        value: `**More roles info use [prefix]roles**`,
                    },
                ])
                .setColor(interaction.member.displayColor)
                .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() });
            interaction.reply({ embeds: [embed] })
        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    },
};