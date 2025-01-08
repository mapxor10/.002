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
const db = new Database("./Bot/Json-Database/Settings/ticket.json");
const db2 = new Database("./Bot/Json-Database/Settings/TempTicket.json");

const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
    name: `/bot/control/ticket`,
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
            if (data.action = "create_panel") {
                db2.set(`Create_Panel_${data.id}`, {
                    guild: data.server,
                    channel: data.channel,
                    gategory: data.gategory,
                    role: data.role,
                    message: data.message,
                    welcome: data.welcome,
                    messageType: data.messageType,
                    welcomeType: data.welcomeType,
                    buttonName: data.buttonName,
                    buttonColor: +data.buttonColor,
                    buttonEmoji: data.buttonEmoji,
                }).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Pending',
                                message: `Creating the new panel.`,
                            }
                        }
                    })
                })
            }
        } else if (data.type == "manage") {
            if (data.action == "get_panel_data") {
                let ID = data.PanelID
                    let panalData = db.get(`ticketData_${ID}`) || null
                    if (!panalData) return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'error',
                                title: 'Error',
                                message: `Can't find any panel with this ID.`,
                            }
                        }
                    })

                    return res.send({
                        data: {
                            ticketData: panalData,
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Panel data loading.`,
                            }
                        }
                    })
            } else if (data.action == "panel_manage") {
                let thumbnailURL = null
                let imageURL = null
                if (data.thumbnail && !data.image) {
                    let channel = client.channels.cache.get(config.ConfigChannel)
                    if (!channel) return
                    var base64Str = data.thumbnail;
                    var path = './';
                    var optionalObj = { 'fileName': `${data.id}_thumbnail`, 'type': 'png' };

                    base64ToImage(base64Str, path, optionalObj)
                        const attachmentPath = `${data.id}_thumbnail.png`;
                        const attachment = new AttachmentBuilder(attachmentPath);

                        channel.send({ files: [attachment] }).then(s => {
                            fs.unlink(attachmentPath, (err) => { });
                            thumbnailURL = s.attachments.first().url
                            db2.set(`Manage_Panel_${data.id}`, {
                                guild: data.server,
                                panelID: data.PanelID,
                                channel: data.channel,
                                message: data.message,
                                thumbnail: thumbnailURL,
                                image: imageURL
                            }).then(() => {
                                return res.send({
                                    data: {
                                        alert: {
                                            active: true,
                                            type: 'success',
                                            title: 'Pending',
                                            message: `Menaging the panel.`,
                                        }
                                    }
                                })
                            })
                        });
                } else if (data.image && !data.thumbnail) {
                    let channel = client.channels.cache.get(config.ConfigChannel)
                    if (!channel) return
                    var base64Str = data.image;
                    var path = './';
                    var optionalObj = { 'fileName': `${data.id}_image`, 'type': 'png' };

                    base64ToImage(base64Str, path, optionalObj)
                        const attachmentPath = `${data.id}_image.png`;
                        const attachment = new AttachmentBuilder(attachmentPath);

                        channel.send({ files: [attachment] }).then(s => {
                            fs.unlink(attachmentPath, (err) => { });
                            imageURL = s.attachments.first().url
                            db2.set(`Manage_Panel_${data.id}`, {
                                guild: data.server,
                                panelID: data.PanelID,
                                channel: data.channel,
                                message: data.message,
                                thumbnail: thumbnailURL,
                                image: imageURL
                            }).then(() => {
                                return res.send({
                                    data: {
                                        alert: {
                                            active: true,
                                            type: 'success',
                                            title: 'Pending',
                                            message: `Menaging the panel.`,
                                        }
                                    }
                                })
                            })
                        });
                } else if (data.image && data.thumbnail) {
                    let channel = client.channels.cache.get(config.ConfigChannel)
                    if (!channel) return
                    var base64Str1 = data.image;
                    var path = './';
                    var optionalObj1 = { 'fileName': `${data.id}_image`, 'type': 'png' };

                    var base64Str2 = data.thumbnail;
                    var optionalObj2 = { 'fileName': `${data.id}_thumbnail`, 'type': 'png' };

                    base64ToImage(base64Str1, path, optionalObj1)
                    base64ToImage(base64Str2, path, optionalObj2)
                        const attachmentPath1 = `${data.id}_image.png`;
                        const attachment1 = new AttachmentBuilder(attachmentPath1);

                        const attachmentPath2 = `${data.id}_thumbnail.png`;
                        const attachment2 = new AttachmentBuilder(attachmentPath2);

                        channel.send({ files: [attachment1] }).then(s => {
                            fs.unlink(attachmentPath1, (err) => { });
                            imageURL = s.attachments.first().url

                            channel.send({ files: [attachment2] }).then((s2) => {
                                fs.unlink(attachmentPath2, (err) => { });
                                thumbnailURL = s2.attachments.first().url
                                db2.set(`Manage_Panel_${data.id}`, {
                                    guild: data.server,
                                    panelID: data.PanelID,
                                    channel: data.channel,
                                    message: data.message,
                                    thumbnail: thumbnailURL,
                                    image: imageURL
                                }).then(() => {
                                    return res.send({
                                        data: {
                                            alert: {
                                                active: true,
                                                type: 'success',
                                                title: 'Pending',
                                                message: `Menaging the panel.`,
                                            }
                                        }
                                    })
                                })
                            })
                        });
                } else {
                    db2.set(`Manage_Panel_${data.id}`, {
                        guild: data.server,
                        panelID: data.PanelID,
                        channel: data.channel,
                        message: data.message,
                        thumbnail: thumbnailURL,
                        image: imageURL
                    }).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Pending',
                                    message: `Menaging the panel.`,
                                }
                            }
                        })
                    })
                }
            } else if (data.action == "button_manage_modals") {
                    let ticketData = db.get("ticketData_" + data.PanelID);
                    let input1Type = 1
                    let input2Type = 1
                    let input3Type = 1
                    let input4Type = 1
                    let input5Type = 1

                    if (data.modal1Type == 'long') input1Type = 2
                    if (data.modal2Type == 'long') input2Type = 2
                    if (data.modal3Type == 'long') input3Type = 2
                    if (data.modal4Type == 'long') input4Type = 2
                    if (data.modal5Type == 'long') input5Type = 2

                    let modals = []

                    if (data.modal1) {
                        modals.push(
                            {
                                label: data.modal1,
                                type: input1Type,
                                place: null,
                                max: null,
                                min: null,
                            }
                        )
                    }

                    if (data.modal2) {
                        modals.push(
                            {
                                label: data.modal2,
                                type: input2Type,
                                place: null,
                                max: null,
                                min: null,
                            }
                        )
                    }

                    if (data.modal3) {
                        modals.push(
                            {
                                label: data.modal3,
                                type: input3Type,
                                place: null,
                                max: null,
                                min: null,
                            }
                        )
                    }

                    if (data.modal4) {
                        modals.push(
                            {
                                label: data.modal4,
                                type: input4Type,
                                place: null,
                                max: null,
                                min: null,
                            }
                        )
                    }

                    if (data.modal5) {
                        modals.push(
                            {
                                label: data.modal5,
                                type: input5Type,
                                place: null,
                                max: null,
                                min: null,
                            }
                        )
                    }



                    ticketData.buttonsData[`button${data.buttonID}`].modals = modals
                    ticketData.buttonsData[`button${data.buttonID}`].welcome.message = data.welcome
                    db.set("ticketData_" + data.PanelID, ticketData).then(() => {
                        return res.send({
                            data: {
                                alert: {
                                    active: true,
                                    type: 'success',
                                    title: 'Done',
                                    message: `Updated button ${data.buttonID} settings.`,
                                }
                            }
                        })
                    })
            } else if (data.action == "manage_addbutton") {
                db2.set(`Manage_addbutton_${data.id}`, {
                    guild: data.server,
                    panelID: data.PanelID,
                    channel: data.channel,
                    gategory: data.gategory,
                    role: data.role,
                    welcome: data.welcome,
                    welcomeType: data.welcomeType,
                    buttonName: data.buttonName,
                    buttonColor: +data.buttonColor,
                    buttonEmoji: data.buttonEmoji,
                }).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Pending',
                                message: `Menaging the panel.`,
                            }
                        }
                    })
                })
            } else if (data.action == "ticket_settings") {
                if (data.transcript) {
                    db.set("tranScript_" + data.server, data.transcript)
                }
                if (data.ticketLimit) {
                    db.set("ticketsLimit_" + data.server, +data.ticketLimit)
                }
                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Updated ticket system settings.`,
                        }
                    }
                })
            }
        }
    }
}