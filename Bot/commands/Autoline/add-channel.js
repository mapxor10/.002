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
const { Database } = require("st.db")
const db = new Database("./Bot/Json-Database/Settings/Autoline.json")

module.exports = {
    name: "add-autoline",
    type: "Autoline",
    botP: [],
    userP: [PermissionFlagsBits.Administrator],
    P: "Administrator",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            if (args.length < 1) {
                return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
              }
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])


            let channels = db.get("Autoline_" + message.guild.id + "_" + client.user.id) || []
            if(channels.includes(channel.id)) return message.reply({content: reply.Autoline.Reply2.replace("[CHANNEL]", channel), allowedMentions: {repliedUser: false}})
            db.push("Autoline_" + message.guild.id + "_" + client.user.id, channel.id).then(() =>{
                return message.reply({content: reply.Autoline.Reply3.replace("[CHANNEL]", channel), allowedMentions: {repliedUser: false}})
        })
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};