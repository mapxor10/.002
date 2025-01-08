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
const db = new Database("./Bot/Json-Database/Settings/Protection.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/protection`,
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

        if (data.type == "whitelist") {
            if (data.action == "add") {
                db.push(`Protection_Add_Whitelist_${data.id}`, {
                    server: data.server,
                    action: data.actionToAdd,
                    user: data.userToAdd,
                }).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Pending',
                                message: `Request sended.`,
                            }
                        }
                    })
                })
            } else if (data.action == "remove") {
                    let userData = db.get("whiteList_" + data.server + "_" + data.userToRemove + "_" + data.id, data.actionToRemove) || null
                    if (userData) {
                        if (userData.includes(data.actionToRemove)) {
                            db.pull("whiteList_" + data.server + "_" + data.userToRemove + "_" + data.id, data.actionToRemove).then(() => {
                                let whiteListedUsers = db.all().filter(d => d.ID.startsWith("whiteList_" + data.server + "_") && d.ID.endsWith(data.id))
                                let resData = []
                                whiteListedUsers.forEach(user => {
                                    let userID = user.ID.split("_")[2]?.trim()
                                    if (user.data.includes(data.actionToRemove)) {
                                        resData.push(userID)
                                    }
                                })
                                return res.send({
                                    data: {
                                        protectionData: resData,
                                        alert: {
                                            active: true,
                                            type: 'success',
                                            title: 'Done',
                                            message: `Removed the user from action bypass.`,
                                        }
                                    }
                                })
                            }).catch()
                        } else {
                            let whiteListedUsers = db.all().filter(d => d.ID.startsWith("whiteList_" + data.server + "_") && d.ID.endsWith(data.id))
                            let resData = []
                            whiteListedUsers.forEach(user => {
                                let userID = user.ID.split("_")[2]?.trim()
                                if (user.data.includes(data.actionToRemove)) {
                                    resData.push(userID)
                                }
                            })
                            return res.send({
                                data: {
                                    protectionData: resData,
                                    alert: {
                                        active: true,
                                        type: 'success',
                                        title: 'Done',
                                        message: `Remove the user from action bypass.`,
                                    }
                                }
                            })
                        }
                    } else {
                        let whiteListedUsers = db.all().filter(d => d.ID.startsWith("whiteList_" + data.server + "_") && d.ID.endsWith(data.id))
                        let resData = []
                        whiteListedUsers.forEach(user => {
                            let userID = user.ID.split("_")[2]?.trim()
                            if (user.data.includes(data.actionToRemove)) {
                                resData.push(userID)
                            }
                        })
                        return res.send({
                            data: {
                                protectionData: resData,
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Remove the user from action bypass.`,
                                }
                            }
                        })
                    }

            }
        } else if (data.type == "config") {
            if (data.action == "manage") {
                if (data.channel) {
                    db.set("protectionLog_" + data.server + "_" + data.id, data.channel).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Updated protection log channel.`,
                                }
                            }
                        })
                    })
                } else if (data.mode) {
                    db.set("antiBots_" + data.server + "_" + data.id, data.mode).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Anti bots system is ${data.mode} now.`,
                                }
                            }
                        })
                    })
                }
            }
        } else if (data.type == "limit") {
            if (data.action == "manage") {
                if (data.actionLimit) {
                    db.set("actionLimit_" + data.actionToManage + "_" + data.server + "_" + data.id, parseInt(data.actionLimit)).then(() => {
                        if (data.actionAutomode) {
                            db.set("autoMode_" + data.actionToManage + "_" + data.server + "_" + data.id, data.actionAutomode)
                        }
                    })
                } else {
                    if (data.actionAutomode) {
                        db.set("autoMode_" + data.actionToManage + "_" + data.server + "_" + data.id, data.actionAutomode)
                    }
                }

                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Updated ${data.actionToManage} action limit ${data.actionLimit}, automode ${data.actionAutomode}.`,
                        }
                    }
                })
            }
        }
    }
}