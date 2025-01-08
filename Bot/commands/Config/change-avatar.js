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
const fetch = require('node-fetch').default;

module.exports = {
    name: "change-avatar",
    type: "Config",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: true,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            if (message.attachments.size > 0) {
                return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
              }
              const png = message.attachments.first();
              if (png.contentType.startsWith('image')) {
                  const pngurl = png.url;
  
                  const response = await fetch(pngurl);
                  const buffer = await response.buffer();
      
                  await client.user.setAvatar(buffer).then(()=>{
                      message.reply({content :reply.Owner.Reply1, allowedMentions: { repliedUser: false }});
                  })
              } else {
                message.reply({ content: reply.Owner.Reply7, allowedMentions: { repliedUser: false }});
              }
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};