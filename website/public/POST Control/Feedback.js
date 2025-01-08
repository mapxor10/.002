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
const db = new Database("./Bot/Json-Database/Settings/Feedback.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/feedback`,
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

        if (data.type == "channels") {
            if (data.action == "add") {
                    let channels = db.get("Feedback_" + data.server + "_" + data.id) || []
                    if (channels.includes(data.channel)) return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'error',
                                title: 'Error',
                                message: `This feedback channel already.`,
                                width: "500px"
                            }
                        }
                    })

                    db.push("Feedback_" + data.server + "_" + data.id, data.channel).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Added the channel to feedback system.`,
                                    width: "500px"
                                }
                            }
                        })
                    })
            } else if (data.action == "remove") {
                    let channels = db.get("Feedback_" + data.server + "_" + data.id) || []
                    if (!channels.includes(data.channel)) return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'error',
                                title: 'Error',
                                message: `This not feedback channel.`,
                                width: "500px"
                            }
                        }
                    })

                    db.pull("Feedback_" + data.server + "_" + data.id, data.channel).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Removed the channel from feedback system.`,
                                    width: "500px"
                                }
                            }
                        })
                    })
            }
        } else if (data.type == "line") {
            if (data.action == "set") {
                let channel = client.channels.cache.get(config.ConfigChannel)
                if (!channel) return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Something went wrong error 550.`
                        }
                    }
                })
                var base64Str = data.img;
                var path = './';
                var optionalObj = { 'fileName': `${data.id}`, 'type': 'png' };

                base64ToImage(base64Str, path, optionalObj)
                    const attachmentPath = `${data.id}.png`;
                    const attachment = new AttachmentBuilder(attachmentPath);

                    channel.send({ files: [attachment] }).then(s => {
                        fs.unlink(attachmentPath, (err) => { });
                        let url = s.attachments.first().url
                        db.set('FeedbackLine_' + data.server + "_" + data.id, url).then(() => {
                            return res.send({
                                data: {
                                    alert: {
                                        active: true,
                                        type: 'success',
                                        title: 'Done',
                                        message: `Setuped the feedback line.`
                                    }
                                }
                            })
                        })
                    });
            } else if (data.action == "delete") {
                db.delete('FeedbackLine_' + data.server + "_" + data.id).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Deleted the feedback line.`
                            }
                        }
                    })
                })
            }
        } else if (data.type == "settings") {
            if (data.emoji && data.emoji != "") {
                db.set("FeedbackEmoji_" + data.server + "_" + data.id, data.emoji).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Updated feedback emoji.`,
                                width: "400px"
                            }
                        }
                    })
                })
            } else {
                db.delete("FeedbackEmoji_" + data.server + "_" + data.id).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Deleted feedback emoji.`,
                                width: "400px"
                            }
                        }
                    })
                })
            }
        }
    }
}