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
    ChatInputCommandInteraction
} = require("discord.js");
const { Database } = require("st.db");
const moment = require('moment');
const BotMakerDB = new Database("/Json-Database/BotMaker/Data.json");


const Prices = new Database("/Json-Database/BotMaker/Prices.json");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");



const fs = require('fs')
let base64ToImage = require('base64-to-image');


const config = require('../../../config.json')
const client = require("../../..").client
module.exports = {
    name: `/manage/subscription`,
    type: "post",
    run: async (req, res) => {
        const balanceSchema = require('../../../Schema/Balance');
        let data = req.body
        const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${data.id}.json`);
        let adminLogChannel = client.channels.cache.get(config.Log)
        if (adminLogChannel) {
            let embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("New Request")
                .setDescription(`**By:** <@!${data.by}>\n**ID:** \`${data.by}\`\n**Request:**\`\`\`${JSON.stringify(data, null, 2).substring(0, 3500) + (JSON.stringify(data, null, 2).length > 3500 ? "..." : "")}\`\`\``)
            adminLogChannel.send({ embeds: [embed] }).catch()
        }
        
        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }

        if (data.Type == "Config") {
            let subData = BotMakerDB.get(`subscriptionData_${data.id}`)

            if (data.server) {
                subData.Guild = data.server
            }
            if (data.log) {
                subData.Log = data.log
            }
            if (data.role) {
                subData.Role = data.role
            }

            if (data.bank) {
                subData.Bank = data.bank
            }

            if (data.probot) {
                subData.Probot = data.probot
            }

            if (data.balance && data.balance > 0) {
                if (usercoins < data.balance) {
                    BotMakerDB.set(`subscriptionData_${data.id}`, subData)
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'error',
                                title: 'Error',
                                message: `Your balance is not enough to add ${data.balance} balance to your subscription.`
                            },
                            page: {
                                url: `/control/subscription/${data.id}`
                            }
                        }
                    })
                }

                let userdata = await balanceSchema.findOne({ userid: data.userId, guild: config.MainGuild })
                userdata.balance = userdata.balance - +data.balance;
                userdata.coins = userdata.balance - +data.balance;
                userdata.save().then(() => {
                    subData.Balance = (subData.Balance || 0) + (+data.balance * 4)
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

            BotMakerDB.set(`subscriptionData_${data.id}`, subData).then(() => {
                res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Saved config settings.`
                        },
                        page: {
                            url: `/control/subscription/${data.id}`
                        }
                    }
                })
            })

        } else if (data.Type == "Manage") {
            if (data.action == "bot_price") {
                Prices.set(`${data.bot}P_${data.server}`, +data.price).then(() => {
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'success',
                                title: 'Done',
                                message: `Updated ${data.bot} price to ${data.price}.`
                            }
                        }
                    })
                })
            }
        }
    }
}