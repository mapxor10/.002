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
const db = new Database("./Bot/Json-Database/Settings/Protection.json")

module.exports = {
    name: "add-whitelist",
    type: "Protection",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: true,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            if (args.length < 1) {
                return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
              }

              let user = args[0]
              let type = args[1]
              if(!user || !type) return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })

              let actions = ['all','bans','kicks','delete_roles','create_roles','delete_channel','create_channel','add_bots']
              if(!actions.includes(type.toLowerCase()))
               return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
            
              let member = message.mentions.members.first() || message.guild.members.cache.get(user)
              if(!member){
                return message.reply({ content: reply.Protection.Reply1, allowedMentions: { repliedUser: false } })
              }

              let check = db.get("whiteList_" + message.guild.id + "_" + member.id + "_" + client.user.id) || []
              if(check.includes(type.toLowerCase())){
                return message.reply({ content: reply.Protection.Reply3.replace("[USER]", member).replace("[ACTION]", type.toLowerCase()), allowedMentions: { repliedUser: false } })
              }

              db.push("whiteList_" + message.guild.id + "_" + member.id + "_" + client.user.id, type.toLowerCase()).then(() =>{
                return message.reply({ content: reply.Protection.Reply2.replace("[ACTION]", type.toLowerCase()).replace("[USER]", member) , allowedMentions: { repliedUser: false } })
              })
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};