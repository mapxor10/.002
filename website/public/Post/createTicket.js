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


let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/tickets/createTicket`,
    type: "post",
    run: async (req, res) => {
        let data = req.body
        let open = 'true'
        let guild = client.guilds.cache.get(config.SupportSystem.guild)
        guild.channels.cache?.forEach(c => {
            if (c.name == data.id && c.topic.split("=")[1]?.trim() == 'open') open = 'false'
        })
        if (open == "false") return res.send({
            data: {
                alert: {
                    active: true,
                    type: 'error',
                    title: 'Failed',
                    message: `You have ticket opened already.`,
                }
            }
        })

        guild.channels.create({
            name: `${data.id}`,
            type: ChannelType.GuildText,
            topic: `${data.topic.replace("=", '')}=open`,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: ["ViewChannel"],
                },
            ]
        }).then((c) => {
            res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'success',
                        title: 'Success',
                        message: `Created your ticket.`,
                    },
                    page: {
                        url: `/ticket/${c.id}`
                    }
                }
            })
        })
    }
}

