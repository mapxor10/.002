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
let db2 = new Database('/Json-Database/Others/Tokens.json')
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");

const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/bot/manage/renew`,
    type: "post",
    run: async (req, res) => {
        const balanceSchema = require('../../../Schema/Balance');
        let data = req.body
        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }


        if (usercoins < +data.price) return res.send({
            data: {
                alert: {
                    active: true,
                    type: 'error',
                    title: 'Error',
                    message: `Your balance is not enough.`
                }
            }
        })
        let bots = db2.get(`Bots`)
        let bot = bots.filter(b => b.ClientID == data.bot)[0] || null
        if (!bot) return res.send({
            data: {
                alert: {
                    active: true,
                    type: 'error',
                    title: 'Error',
                    message: `Cant find this bot.`
                }
            }
        })
        let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
        userdata.balance = userdata.balance - +data.price;
        userdata.coins = userdata.balance - +data.price;
        userdata.save().then(() => {
            const endsTime = moment(bot.endTime).add(+data.months, 'months').format('YYYY-MM-DD HH:mm:ss');
            bot.endTime = endsTime
            db2.set(`Bots`, bots).then(() => {
                let logId = logsdb.get(`LogID`) || 1
                logsdb.push(`Logs_${data.userId}`, {
                    id: logId,
                    reason: `تجديد اشتراك ${data.bot} ${+data.months} شهور`,
                    amount: +data.price,
                    status: 'danger',
                    action: 'خصم',
                    date: moment().format('YYYY-MM-DD hh:mm'),
                }).then(() => {
                    logsdb.set(`LogID`, logId + 1)
                })

                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Added ${+data.months * 30} days to ${data.name}.`,
        
                        },
                        page: {
                            url: `/manage/bots`
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
    }
}

