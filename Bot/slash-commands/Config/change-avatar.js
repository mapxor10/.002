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
const fetch = require('node-fetch').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('change-avatar')
        .setDescription('Change bot\'s avatar.')
        .addAttachmentOption(p => p
            .setName('image')
            .setDescription('Upload the image')
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
            await interaction.deferReply({ ephemeral: false });
            const png = interaction.options.getAttachment("image");
            const pngurl = png.url;

            const response = await fetch(pngurl);
            const buffer = await response.buffer();

            await client.user.setAvatar(buffer).then(()=>{
                interaction.editReply(`${reply.Owner.Reply1}`);
            })
        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    },
};