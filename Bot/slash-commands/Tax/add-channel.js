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
const { ChannelType } = require("discord-api-types/v9");
const { Database } = require("st.db")
const db = new Database("./Bot/Json-Database/Settings/Tax.json")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-tax')
        .setDescription('Add new tax channel.')
        .addChannelOption(channel => channel
            .setName("channel")
            .setDescription("Pick the channel to add.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    ,
    type: "Tax",
    botP: [],
    userP: [PermissionFlagsBits.Administrator],
    P: "Administrator",
    ownerOnly: false,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    async run(client, interaction, language, reply, replyEmbeds, name) {
        try {
            let channel = interaction.options.getChannel("channel")

            let channels = db.get("Tax_" + interaction.guild.id + "_" + client.user.id) || []
            if(channels.includes(channel.id)) return interaction.reply({content: reply.Tax.Reply1.replace("[CHANNEL]", channel), allowedMentions: {repliedUser: false}})
            db.push("Tax_" + interaction.guild.id + "_" + client.user.id, channel.id).then(() =>{
                return interaction.reply({content: reply.Tax.Reply2.replace("[CHANNEL]", channel), allowedMentions: {repliedUser: false}})
        })
        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    },
};