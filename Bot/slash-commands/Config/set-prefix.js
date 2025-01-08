const {
    Client,
    Collection,
    Discord,
    createInvite,
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
const { Database } = require("st.db")
const prefixdb = new Database("/Json-Database/Others/PrefixData.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-prefix')
        .setDescription('Change the bot\'s prefix.')
        .addStringOption(p => p
            .setName('prefix')
            .setDescription('Type the new prefix')
            .setMaxLength(3)
            .setRequired(true))
    ,
    type: "Config",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: true,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    async run(client, interaction, language, reply, replyEmbeds, name) {
        try {
            let prefix = interaction.options.getString(`prefix`)

            prefixdb.set("Prefix_" + client.user.id, prefix).then(() => {
                interaction.reply({ content: reply.Others.Reply10.replace('[PREFIX]', `\`${prefix}\``), allowedMentions: { repliedUser: false } })
            })
        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    },
};