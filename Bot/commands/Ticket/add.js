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
const db = new Database("./Bot/Json-Database/Settings/Ticket.json")
const db2 = new Database("./Bot/Json-Database/Settings/TempTicket.json")

module.exports = {
    name: "add",
    type: "Ticket",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name) => {
        try {
            let ticketData = db2.get("ticketData_" + client.user.id + "_" + message.channel.id) || null
            if (!ticketData) return
            if (!message.channel.name.startsWith(`ticket-`) && !ticketData) return


            const auther = await message.guild.members.fetch(message.author.id);

            const role1 = auther.roles.cache.some(role => role.id === ticketData.support_role);

            if (!role1) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(reply.Ticket.Reply1)
                return message.reply({ embeds: [embed], ephemeral: true, allowedMentions: { repliedUser: false } });
            }

            if (args.length < 1) {
                return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
            }

            let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            if(!member){
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(reply.Ticket.Reply2)
                return message.reply({ embeds: [embed], ephemeral: true, allowedMentions: { repliedUser: false }})
            }

            message.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true,
                SendMessages: true,
            }).then(()=>{
                const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(reply.Ticket.Reply3.replace("[USER]", member).replace("[ROOM]", message.channel))
                message.reply({embeds: [embed], ephemeral: true, allowedMentions: { repliedUser: false }})
            })
            
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};