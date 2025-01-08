const {
    Client,
    Collection,
    Discord,
    createInvite,
    ChannelType,
    WebhookClient,
    PermissionsBitField,
    GatewayIntentBits,
    Partials,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    Events,
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
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Embed,
    AttachmentBuilder,
    ChatInputCommandInteraction
} = require("discord.js");
const { Database } = require("st.db");

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/ticket/actions`,
    type: "post",
    run: async (req, res) => {
        let data = req.body
        let guild = client.guilds.cache.get(config.SupportSystem.guild)
        let Ticketscheck = guild.channels.cache.get(data.id)
        let status = Ticketscheck.topic.split("=")[1]?.trim()
        if (status == "open" && data.action == "open") return
        if (status == "close" && data.action == "close") return
        if (data.action == "open") {
            let reason = Ticketscheck.topic.split("=")[0]?.trim()
            let bot = Ticketscheck?.topic?.split("=")[2]?.trim() || null
            let topic = `${reason}=open`
            if (bot) topic = `${reason}=open=${bot}`
            Ticketscheck.setTopic(`${topic}`).then(() => {
                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Opened the ticket.`,
                        },
                        page: {
                            url: `/ticket/${data.id}`
                        }
                    }
                })
            })
        } else {
            let reason = Ticketscheck.topic.split("=")[0]?.trim()
            let bot = Ticketscheck?.topic?.split("=")[2]?.trim() || null
            let topic = `${reason}=close`
            if (bot) topic = `${reason}=close=${bot}`
            Ticketscheck.setTopic(`${topic}`).then(() => {
                res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Closed the ticket.`,
                        },
                        page: {
                            url: `/ticket/${data.id}`
                        }
                    }
                })
            })
        }
    }
}

