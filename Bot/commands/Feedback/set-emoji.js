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
const db = new Database("./Bot/Json-Database/Settings/Feedback.json")
const isImageUrl = require('is-image-url');

module.exports = {
    name: "set-feedbackemoji",
    type: "Feedback",
    botP: [],
    userP: [PermissionFlagsBits.Administrator],
    P: "Administrator",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            const emoji = args[0]
            if(emoji){
                message.react(emoji).then(() =>{
                    db.set("FeedbackEmoji_" + message.guild.id + "_" + client.user.id, emoji).then(() => {
                        const done = new EmbedBuilder()
                            .setColor(`DarkButNotBlack`)
                            .setDescription(reply.Feedback.Reply7)
                        message.reply({ embeds: [done], allowedMentions: { repliedUser: false } })
                    })
                }).catch((err) =>{
                    return message.reply({ content: reply.NotFound.Reply3, allowedMentions: { repliedUser: false } })
                })
            }else{
                let check = db.get("FeedbackEmoji_" + message.guild.id + "_" + client.user.id) || null
                if(!check){
                    return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
                }else{
                    db.delete("FeedbackEmoji_" + message.guild.id + "_" + client.user.id).then(() =>{
                        message.reply({ content: reply.Feedback.Reply8, allowedMentions: { repliedUser: false } })
                    })
                }
            }

        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};