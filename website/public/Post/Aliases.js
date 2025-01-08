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
const moment = require('moment');
let aliasesdb = new Database('/Json-Database/Others/Aliases.json')
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");

const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/bot/manage/aliases`,
    type: "post",
    run: async (req, res) => {
        const balanceSchema = require('../../../Schema/Balance');
        let data = req.body

        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }

        if (data.action == "add") {
            let price = Prices.get(`AliasesP_${config.MainGuild}`) || 1
            if (usercoins < price) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `Your balance is not enough.`
                    }
                }
            })
            let check = aliasesdb.get(`${data.aliase}_${data.bot}`) || null
            if (check) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `Your bot have this aliase on ${check} command.`,

                    }
                }
            })
            if (check == data.command) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `Your bot have this aliase on this command already.`,

                    }
                }
            })
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            userdata.balance = userdata.balance - +price;
            userdata.coins = userdata.balance - +price;

            userdata.save().then(() => {
                let logId = logsdb.get(`LogID`) || 1
                logsdb.push(`Logs_${data.userId}`, {
                    id: logId,
                    reason: `أضافه اختصار جديد الي ${data.bot}`,
                    amount: price,
                    status: 'danger',
                    action: 'خصم',
                    date: moment().format('YYYY-MM-DD hh:mm'),
                }).then(() => {
                    logsdb.set(`LogID`, logId + 1)
                })
                aliasesdb.set(`${data.aliase}_${data.bot}`, data.command).then(async () => {
                    let commandAliases = aliasesdb.all().filter(d => d.ID.endsWith(data.bot) && d.data == data.command)
                    let updatedAliases = []
                    commandAliases.forEach(aliase => {
                        updatedAliases.push(
                            {
                                aliase: aliase.ID.split("_")[0]?.trim(),
                                command: aliase.data
                            }
                        )
                    })
                    res.send({
                        data: {
                            updatedAliases: updatedAliases,
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Added the new aliase to ${data.command}.`,

                            }
                        }
                    })
                })
            }).catch(() => {
                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Error updating data.`
                        }
                    }
                })
            })
        } else if (data.action == "remove") {
            let check = aliasesdb.get(`${data.aliase}_${data.bot}`) || null
            if (!check) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `Cant't find this aliase.`
                    }
                }
            })

            aliasesdb.delete(`${data.aliase}_${data.bot}`).then(async () => {
                let commandAliases = aliasesdb.all().filter(d => d.ID.endsWith(data.bot) && d.data == data.command)
                let updatedAliases = []
                commandAliases.forEach(aliase => {
                    updatedAliases.push(
                        {
                            aliase: aliase.ID.split("_")[0]?.trim(),
                            command: aliase.data
                        }
                    )
                })

                res.send({
                    data: {
                        updatedAliases: updatedAliases,
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Deleted aliase for ${data.command}.`,

                        }
                    }
                })
            })
        }
    }
}

