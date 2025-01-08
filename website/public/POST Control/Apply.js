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
const db = new Database("./Bot/Json-Database/Settings/Apply.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/apply`,
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
            let applicationChannel = data.applicationChannel
            let requestsChannel = data.requestsChannel
            let applicationRole = data.applicationRole
            let applicationMessage = data.applicationMessage
            let applicationMessageType = data.applicationMessageType
            db.set(`Create_Applection_${data.id}`, {
                guild: data.server,
                applicationChannel: applicationChannel,
                requestsChannel: requestsChannel,
                applicationRole: applicationRole,
                applicationMessage: applicationMessage,
                applicationMessageType: applicationMessageType,
                questions: [
                    data.question1,
                    data.question2,
                    data.question3,
                    data.question4,
                    data.question5,
                ]
            }).then(async () => {
                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Pending',
                            message: `Creating the applection.`,
                        }
                    }
                })
            })
        } else if (data.type == "config") {
            if (data.action == "manage") {
                if (data.adminRole) {
                    await db.set("applyAdmin_" + data.server + "_" + data.id, data.adminRole)
                }
                if (data.resultsChannel) {
                    await db.set("resultsLog_" + data.server + "_" + data.id, data.resultsChannel)
                }
                if (data.DMmodeAccept) {
                        let dmData = db.get("dm_Mode_" + data.server + "_" + data.id) || { accept: "off", reject: "off" }
                        await db.set("dm_Mode_" + data.server + "_" + data.id, {
                            accept: data.DMmodeAccept,
                            reject: dmData.reject,
                        })
                }
                if (data.DMmodeReject) {
                        let dmData = db.get("dm_Mode_" + data.server + "_" + data.id) || { accept: "off", reject: "off" }
                        await db.set("dm_Mode_" + data.server + "_" + data.id, {
                            accept: dmData.accept,
                            reject: data.DMmodeReject,
                        })
                }

                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Updated apply config settings.`,
                        }
                    }
                })
            }
        } else if (data.type == "manage") {
            if (data.action == "get_data_app") {
                let ID = data.appID
                    let appData = db.get("appData_" + ID + "_" + data.id) || null
                    let appStatus = db.get("applectionStatus_" + ID + "_" + data.id) || "on"
                    if (!appData) {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'error',
                                    title: 'Error',
                                    message: `Cant find any application with this ID.`,
                                }
                            }
                        })
                    }
                    return res.send({
                        data: {
                            applyData: appData,
                            appStatus: appStatus,
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Loading application data.`,
                            }
                        }
                    })
            } else if (data.action == "set_data") {
                db.set(`Applection_Update_Data_${data.id}`, {
                    guild: data.server,
                    appStatus: data.appStatus,
                    appMessage: data.appMessage,
                    appID: data.appID,
                    questions: [
                        data.qestion1,
                        data.qestion2,
                        data.qestion3,
                        data.qestion4,
                        data.qestion5,
                    ]
                }).then(async () => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Updating the data.`,
                            }
                        }
                    })
                })
            }
        }
    }
}