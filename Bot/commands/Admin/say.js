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
    name: "say",
    type: "System",
    botP: [],
    userP: [PermissionFlagsBits.ManageMessages],
    P: "ManageMessages",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            const msg1 = message.content.split(' ').slice(2).join(' ')
            const msg = args.slice(1).join(' ')
            if(!channel) {
              return  message.reply({content: reply.Others.Reply3, allowedMentions: { repliedUser: false }}).catch(async(error)=>{return console.log(error.message)})
            }
            if(!msg1) return message.reply({content: reply.System.Say1, allowedMentions: { repliedUser: false } })
            if(channel) {
                let image = message.attachments.first()
                if (image) {
                    channel.send({ content: `${msg}`, files: [image.proxyURL] }).then(() => {
                        message.react('✔').catch()
                    }).catch(async(error)=>{message.react('❌').catch(); console.log(error.message)})
                }
                if(!image) {
                    channel.send(`${msg}`).then(() => {
                        message.react('✔').catch()
                    }).catch(async(error)=>{message.react('❌').catch(); console.log(error.message)})
                }
            }
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};