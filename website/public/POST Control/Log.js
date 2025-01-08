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
const fs = require('fs')
let base64ToImage = require('base64-to-image');
const db = new Database("./Bot/Json-Database/Systems/Log.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/log`,
    type: "post",
    run: async (req, res) => {
        let data = req.body
        let adminLogChannel = client.channels.cache.get(config.Log)
        if (adminLogChannel) {
            let embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("New Request")
                .setDescription(`**By:** <@!${data.by}>\n**ID:** \`${data.by}\`\n**Request:**\`\`\`${JSON.stringify(data, null, 2).substring(0, 3500) + (JSON.stringify(data, null, 2).length > 3500 ? "..." : "")}\`\`\``)
            adminLogChannel.send({ embeds: [embed] }).catch()
        }

        if (data.type == "setup") {
            if (data.action == "event") {
                let event = data.event
                let channel = data.channel
                    const check = db.get(`${event}_${data.server}_${data.id}`) || { channel: null, color: "Green" }

                    if (!channel) {
                        db.delete(`${event}_${data.server}_${data.id}`).then(() => {
                            return res.send({
                                data: {
                                    alert: {
                                        active: true,
                                        type: 'success',
                                        title: 'Done',
                                        message: `Deleted the logging system for ${event} event.`,
                                    }
                                }
                            })
                        })
                    } else {
                        db.set(`${event}_${data.server}_${data.id}`, {
                            channel: data.channel,
                            color: check.color
                        }).then(() => {
                            return res.send({
                                data: {
                                    alert: {
                                        active: true,
                                        type: 'success',
                                        title: 'Done',
                                        message: `Updated logging system for ${event} event.`,
                                    }
                                }
                            })
                        })
                    }
            }
        } else if (data.type == "manage") {
            if (data.action == "event_color") {
                let event = data.event
                let color = data.color
                    const check = db.get(`${event}_${data.server}_${data.id}`) || { channel: null, color: "Green" }
                    db.set(`${event}_${data.server}_${data.id}`, {
                        channel: check.channel,
                        color: color
                    }).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Updated logging system color for ${event} event to ${color}.`,
                                }
                            }
                        })
                    })


            }
        }
    }
}