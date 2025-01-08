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
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
const BotMakerDB = new Database("/Json-Database/BotMaker/Data");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");


let languagedb = new Database('/Json-Database/Others/Language.json')
const ownerDB = new Database("/Json-Database/Others/OwnerData");
const prefixDB = new Database("/Json-Database/Others/PrefixData.json");
let db2 = new Database('/Json-Database/Others/Tokens.json')
const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/bot/manage/config`,
    type: "post",
    run: async (req, res) => {
        const balanceSchema = require('../../../Schema/Balance');
        let data = req.body

        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }

        let status = 'true'
        if (data.prefix) {
            prefixDB.set(`Prefix_${data.bot}`, data.prefix)
        }

        if (data.owner) {
            ownerDB.set(`Owner_${data.bot}`, data.owner)
        }



        if (data.language) {
            const botsData = db2.get("Bots")
            const DB = botsData.filter(da => da.ClientID === data.bot);
            let check = languagedb.get(`${data.bot}`) || 'EN'
            if (check != data.language) {
                const price = Prices.get(`LanguageP_${config.MainGuild}`) || 1
                if (usercoins < price) return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Your balance is not enough.`
                        }
                    }
                }), status = 'false'
                let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
                userdata.balance = userdata.balance - +price;
                userdata.coins = userdata.balance - +price;
                userdata.save().then(() => {
                    languagedb.set(`${data.bot}`, data.language).then(() => {
                        let logId = logsdb.get(`LogID`) || 1
                        logsdb.push(`Logs_${data.userId}`, {
                            id: logId,
                            reason: `تغير لغه البوت ${data.bot} الي ${data.language}`,
                            amount: price,
                            status: 'danger',
                            action: 'خصم',
                            date: moment().format('YYYY-MM-DD hh:mm'),
                        }).then(() => {
                            logsdb.set(`LogID`, logId + 1)
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
                    }), status = 'false'
                })

                res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Updated config data & changed bot language.`,

                        },
                        page: {
                            url: `/manage/bot/${data.bot}`
                        }
                    }
                }), status = 'false'

                let MainGuild = client.guilds.cache.get(config.MainGuild)
                const GuildBotMAkerdata = await BotMakerDB.get(`BotMakerData_${config.MainGuild}`)
                const logs = GuildBotMAkerdata?.sellslog

                if (MainGuild) {
                    try {
                        let LogChannel = MainGuild.channels.cache.get(logs)
                        if (LogChannel) {
                            let logMSG = ""
                            let flag = "🇸🇦"
                            let language = "عربي"
                            if (data.language == "AR") {
                                logMSG = `تم تغير لغه بوت Super${DB[0].PurchasesID || ''} بواسطه **<@!${data.userId}>**`
                            } else {
                                flag = "🇺🇸"
                                language = "English"
                                logMSG = `Super${DB[0].PurchasesID || ''} bot language has been changed by **<@!${data.userId}>**`
                            }
                            const button = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`lockedbutton`)
                                        .setStyle(2)
                                        .setEmoji(flag)
                                        .setLabel(language)
                                        .setDisabled(true),
                                );
                            LogChannel.send({ content: logMSG, components: [button] })
                        }
                    } catch (error) {

                    }
                }
            }
        }

        if (status == 'true') {
            status = 'false'
            res.send({
                data: {
                    alert: {
                        active: true,
                        type: 'success',
                        title: 'Done',
                        message: `Updated config data.`,

                    },
                    page: {
                        url: `/manage/bot/${data.bot}`
                    }
                }
            })
        }
    }
}

