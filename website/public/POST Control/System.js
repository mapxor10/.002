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
const db1 = new Database("./Bot/Json-Database/Systems/Reply.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/system`,
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
        if (data.type == "reply") {
            if (data.action == "add") {
                let replies = db1.get("Replies_" + data.server + "_" + data.id) || []
                let check = replies.filter(r => r?.word == data.Replyword)[0]
                if (check) return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `This word exists already.`,
                        }
                    }
                })

                db1.push("Replies_" + data.server + "_" + data.id, {
                    word: data.Replyword,
                    responses: [data.response],
                    role: data.enabledRole,
                    includes: data.include,
                    reply: data.sendAsReply,
                }).then(() => {
                    let updatedReplies = db1.get("Replies_" + data.server + "_" + data.id) || []
                    const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.id}.json`);
                    let localBotsData = localData.get(`data_${data.id}`)
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Added the new reply.`,
                            },
                            replies: updatedReplies.reverse(),
                            roles: localBotsData?.servers?.filter(s => s.id == data.server)[0]?.roles
                        }
                    })
                })
            } else if (data.action == 'remove') {
                let replies = db1.get("Replies_" + data.server + "_" + data.id) || []
                let check = replies.filter(r => r?.word == data.Replyword)[0]
                if (!check) return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Cant find this reply reload your page.`,
                        }
                    }
                })


                db1.set("Replies_" + data.server + "_" + data.id, replies.filter(r => r?.word != data.Replyword)).then(() => {
                    let updatedReplies = db1.get("Replies_" + data.server + "_" + data.id) || []
                    const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.id}.json`);
                    let localBotsData = localData.get(`data_${data.id}`)
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Delete the reply.`,
                            },
                            replies: updatedReplies.reverse(),
                            roles: localBotsData?.servers?.filter(s => s.id == data.server)[0]?.roles
                        }
                    })
                })
            } else if (data.action == 'edit') {
                let replies = db1.get("Replies_" + data.server + "_" + data.id) || []
                let check = replies.filter(r => r?.word == data.Replyword)[0]
                if (!check) return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Cant find this reply reload your page.`,
                        }
                    }
                })

                check.word = data.Replyword
                check.responses[0] = data.response
                check.role = data.enabledRole
                check.includes = data.include
                check.reply = data.sendAsReply

                db1.set("Replies_" + data.server + "_" + data.id, replies).then(() => {
                    let updatedReplies = db1.get("Replies_" + data.server + "_" + data.id) || []
                    const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.id}.json`);
                    let localBotsData = localData.get(`data_${data.id}`)
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Updated the reply.`,
                            },
                            replies: updatedReplies.reverse(),
                            roles: localBotsData?.servers?.filter(s => s.id == data.server)[0]?.roles
                        }
                    })
                })
            }
        }
    }
}