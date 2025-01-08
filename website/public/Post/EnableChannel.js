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
let db = new Database('/Json-Database/Others/EnableChannels.json')
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");

const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/bot/manage/commandchannels`,
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
            let price = 1
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
            let check = db.get(`Enable_${data.command}_${data.bot}_${data.server}`) || []
            if (check.includes(data.channel)) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `This channel enabled already for this command.`,

                    }
                }
            })
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            userdata.balance = userdata.balance - +price;
            userdata.coins = userdata.balance - +price;
            userdata.save().then(() => {
                db.push(`Enable_${data.command}_${data.bot}_${data.server}`, data.channel).then(async () => {
                    let logId = logsdb.get(`LogID`) || 1
                    logsdb.push(`Logs_${data.userId}`, {
                        id: logId,
                        reason: `تشغيل امر ${data.command} في غرفه جديد لبوت ${data.bot}`,
                        amount: price,
                        status: 'danger',
                        action: 'خصم',
                        date: moment().format('YYYY-MM-DD hh:mm'),
                    }).then(() => {
                        logsdb.set(`LogID`, logId + 1)
                    })
                    let EnabledChannel = db.get(`Enable_${data.command}_${data.bot}_${data.server}`) || []
                    const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.bot}.json`);
                    let localBotsData = localData.get(`data_${data.bot}`)
                    let channelsFiltered = []
                    localBotsData.servers.filter(s => s.id == data.server)[0].channels.forEach(channel => {
                        if (channel.type == 0 && EnabledChannel.includes(channel.id)) {
                            channelsFiltered.push(channel)
                        }
                    })
                    res.send({
                        data: {
                            updatedChannels: channelsFiltered,
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
            let check = db.get(`Enable_${data.command}_${data.bot}_${data.server}`) || []
            if (!check.includes(data.channel)) return res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'error',
                        title: 'Error',
                        message: `Cant find this channel in enabled channels.`,
                    }
                }
            })

            db.pull(`Enable_${data.command}_${data.bot}_${data.server}`, data.channel).then(async () => {
                let EnabledChannel = db.get(`Enable_${data.command}_${data.bot}_${data.server}`) || []
                const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.bot}.json`);
                let localBotsData = localData.get(`data_${data.bot}`)
                let channelsFiltered = []
                localBotsData.servers.filter(s => s.id == data.server)[0].channels.forEach(channel => {
                    if (channel.type == 0 && EnabledChannel.includes(channel.id)) {
                        channelsFiltered.push(channel)
                    }
                })
                res.send({
                    data: {
                        updatedChannels: channelsFiltered,
                    }
                })
            })
        }
    }
}

