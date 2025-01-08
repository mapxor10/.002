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

const moment = require('moment');

const { Database } = require("st.db");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");

const Prices = new Database("/Json-Database/BotMaker/Prices.json");
const IdsData = new Database("/Json-Database/BotMaker/IDs.json");

const db2 = new Database("/Json-Database/Others/Tokens.json");

const prefixDB = new Database("/Json-Database/Others/PrefixData");
const OwnerDB = new Database("/Json-Database/Others/OwnerData");
const BotMakerDB = new Database("/Json-Database/BotMaker/Data");
const TokenDB = new Database("/Json-Database/Others/UnusedTokens.json");
const runDB = new Database("/Json-Database/BotMaker/RunBots.json");
const config = require('../../../config.json')
const commands = new Database('/commands.json')

const subTokens = new Database("/Json-Database/Others/subTokens.json");
const logsdb = new Database("/Json-Database/DashBoard/Logs.json");
const client = require("../../../").client
module.exports = {
    name: `/order/bot`,
    type: "post",
    run: async (req, res) => {
        const balanceSchema = require('../../../Schema/Balance');
        let data = req.body
        let type = data.type

        let adminLogChannel = client.channels.cache.get(config.Log)
        if (adminLogChannel) {
            let embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("New Request")
                .setDescription(`**By:** <@!${data.by}>\n**ID:** \`${data.by}\`\n**Request:**\`\`\`${JSON.stringify(data, null, 2).substring(0, 3500) + (JSON.stringify(data, null, 2).length > 3500 ? "..." : "")}\`\`\``)
            adminLogChannel.send({ embeds: [embed] }).catch()
        }

        let botCommands = []
        let configCommands = commands.get('config')
        botCommands.push(...configCommands)
        let args;
        if (type === 'Autoline') args = { priceKey: "AutolineP", name: "خط تلقائي", commands: commands.get('Autoline').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Suggestion') args = { priceKey: "SuggestionP", name: "إقترحات", commands: commands.get('Suggestion').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Tax') args = { priceKey: "TaxP", name: "ضريبه", commands: commands.get('Tax').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'System') args = { priceKey: "SystemP", name: "إداره", commands: commands.get('System').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Ticket') args = { priceKey: "TicketP", name: "تذاكر", commands: commands.get('Ticket').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Giveaway') args = { priceKey: "GiveawayP", name: "هدايا", commands: commands.get('Giveaway').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Feedback') args = { priceKey: "FeedbackP", name: "آراء", commands: commands.get('Feedback').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Protection') args = { priceKey: "ProtectionP", name: "حمايه", commands: commands.get('Protection').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Apply') args = { priceKey: "ApplyP", name: "تقديمات", commands: commands.get('Apply').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Log') args = { priceKey: "LogP", name: "سجلات", commands: commands.get('Log').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Selfrole') args = { priceKey: "SelfroleP", name: "جمع رتب", commands: commands.get('Selfrole').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Package') args = { priceKey: "PackageP", name: "بكج رمضان 1", commands: commands.get('commandPackage').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'Package2') args = { priceKey: "Package2P", name: "بكج رمضان 2", commands: commands.get('commandPackage').forEach(comID => { let com = commands.get(comID); botCommands.push(com) }) }
        if (type === 'RPL-Subscription') args = { priceKey: "RPL-SubscriptionP", name: "إشتراك بوت ميكر", commands: [] }


        let subtokens = subTokens.get("TOKENS") || []
        let subtoken = subtokens[0]
        let fTokens = subtokens.filter(t => t.id != subtoken.id)
        if (botCommands.length - configCommands.length == 0) subTokens.set("TOKENS", fTokens)


        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.by, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }
        let botPrice = data.price

        if (usercoins < botPrice) return res.send({
            data: {
                alert: {
                    active: true,
                    type: 'error',
                    title: 'Error',
                    message: `Your balance is not enough.`
                }
            }
        })

        let MainGuild = client.guilds.cache.get(config.MainGuild)
        let adminlog = client.channels.cache.get(config.Log)
        const GuildBotMAkerdata = await BotMakerDB.get(`BotMakerData_${config.MainGuild}`) || null
        const logs = GuildBotMAkerdata?.sellslog || null

        const prefix = data.Prefix.toLowerCase()
        if (prefix.startsWith('/')) return res.send({
            data: {
                alert: {
                    active: true,
                    type: 'error',
                    title: 'Error',
                    message: `You cant set "/" as prefix for the bot.`
                }
            }
        })
        const owner = data.Owner
        const username = data.username
        let userdata = await balanceSchema.findOne({ userid: data.by, guild: config.MainGuild })
        userdata.balance = userdata.balance - +botPrice;
        userdata.coins = userdata.balance - +botPrice;
        userdata.save().then(async () => {
            const BotID = IdsData.get(`${type}ID`) || 1
            const purchasesID = IdsData.get(`PurchasesID`) || 1
            const NodeID = IdsData.get(`NodeID`) || 1
            IdsData.set(`${type}ID`, BotID + 1).then(() => {
                IdsData.set(`PurchasesID`, purchasesID + 1).then(() => {
                    IdsData.set(`NodeID`, NodeID)
                })
            })

            let member = MainGuild?.members.cache.get(data.Buyer)

            // botMaker sub
            if (data.type == 'RPL-Subscription') {
                let adminChannel = client.channels.cache.get(config.adminChannel)
                if (!adminChannel) {
                    coinsDB.set(`Coins_${config.MainGuild}_${data.Buyer}`, {
                        Coins: usercoins,
                    }).then(() => {
                        subTokens.set("TOKENS", subtokens)
                    })
                    console.log("Cant find admin channel")
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'error',
                                title: 'Error',
                                message: `Error occurred while processing the purchase.`
                            }
                        }
                    })
                }
                if (!subtoken) {
                    coinsDB.set(`Coins_${config.MainGuild}_${data.Buyer}`, {
                        Coins: usercoins,
                    })
                    return res.send({
                        data: {
                            alert: {
                                active: true,
                                type: 'warning',
                                title: 'Warn',
                                message: `You can't buy RPL-Subscription now!`
                            }
                        }
                    })
                }
                const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
                const endTime = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss');

                let embed = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle("New Subscription")
                    .setDescription(`\`\`\`
{
    "Token": "${subtoken.token}",
    "ID": "${subtoken.id}",
    "Owner": "${owner}",
    "Port": ${subtoken.port},
    "startTime": "${startTime}",
    "endTime": "${endTime}"
}
\`\`\`
`)
                let button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`${data.Buyer}_${subtoken.id}_${subtoken.port}_${endTime}_substarted`)
                            .setLabel(`Started`)
                            .setStyle(ButtonStyle.Secondary)
                    )
                adminChannel.send({ embeds: [embed], components: [button] }).then(() => {
                    let logId = logsdb.get(`LogID`) || 1
                    logsdb.push(`Logs_${data.by}`, {
                        id: logId,
                        reason: `شراء أشتراك بوت ميكر`,
                        amount: botPrice,
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
                                title: 'Pending',
                                message: `Your subscription will be ready soon!.`
                            }
                        }
                    })

                })
                return
            }


            const tokens = TokenDB.get(`TOKENS`) || []
            if (tokens.length <= 20) {
                if (adminlog) {
                    let embed = new EmbedBuilder()
                        .setColor('Yellow')
                        .setTitle(`تحذير`)
                        .setDescription(`متبقي فقط ${tokens.length - 1} توكن غير مستخدم`)
                        .setTimestamp()
                    adminlog.send({ embeds: [embed] })
                }
            }
            const token = tokens[0] || null
            if (!token) {
                coinsDB.set(`Coins_${config.MainGuild}_${data.Buyer}`, {
                    Coins: usercoins
                })
                return res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'warning',
                            title: 'Warn',
                            message: `Try agine later.`
                        }
                    }
                })
            }
            TokenDB.pull(`TOKENS`, token)
            const client1 = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,] });
            client1.login(token).then(async () => {
                res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'success',
                            title: 'Done',
                            message: `Your bot is ready ${data.type} bot.`
                        },
                        page: {
                            url: `/manage/bots`
                        }
                    }
                })

                if (member) {
                    const buyerembed = new EmbedBuilder()
                        .setFooter({ text: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                        .setAuthor({ name: MainGuild.name, iconURL: MainGuild.iconURL({ dynamic: true }) })
                        .setTitle(`Your ${type} bot is ready`)
                        .setDescription(`Owner: ${owner}\n\nClientID: ${client1.user.id}\n\nPrefix: ${prefix}\n\nBot's username: ${client1.user.username}\n\nPurchase ID: ${purchasesID}`)
                        .setColor('DarkButNotBlack')
                        .setTimestamp(Date.now())

                    const invite_Button = new ActionRowBuilder().addComponents([
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client1.user.id}&permissions=8&scope=bot%20applications.commands`)
                            .setLabel(`invite`)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Link)
                            .setURL(`https://canary.discord.com/channels/${config.Server}/${config.Rate}`)
                            .setLabel(`Rate us`)
                            .setDisabled(false),
                    ]);
                    member.send({ embeds: [buyerembed], components: [invite_Button] }).catch(err => {
                        const invite_Button = new ActionRowBuilder().addComponents([
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client1.user.id}&permissions=8&scope=bot%20applications.commands`)
                                .setLabel(`invite`)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setStyle(ButtonStyle.Link)
                                .setURL(`https://canary.discord.com/channels/${config.Server}/${config.Rate}`)
                                .setLabel(`Rate us`)
                                .setDisabled(false),
                            new ButtonBuilder()
                                .setCustomId(`resendbot_${member.user.id}`)
                                .setStyle(ButtonStyle.Success)
                                .setLabel(`Resend`)
                                .setDisabled(false),
                        ]);
                        if (adminlog) {
                            let embed = new EmbedBuilder()
                                .setColor('DarkBlue')
                                .setTitle(`حدث خطا اثناء إرسال فاتره بوت الي العميل`)
                                .setDescription(`العميل : ${member}\nالسبب : الخاص مقفل`)
                                .setTimestamp()
                            adminlog.send({ embeds: [embed, buyerembed], components: [invite_Button] })
                        }
                    })
                }



                if (GuildBotMAkerdata?.role) {
                    try {
                        await member?.roles?.add(GuildBotMAkerdata?.role)
                        await member?.roles?.add(config.RateRole)
                    } catch (error) {

                    }
                }

                if (MainGuild) {
                    try {
                        let LogChannel = MainGuild.channels.cache.get(logs)
                        if (LogChannel) {
                            LogChannel.send({ content: `__${type}__ bot has been purchased by ${username}.` })
                        }
                    } catch (error) {

                    }
                }

                const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
                let d = 30
                if (type == "Package2") d = 360
                const endTime = moment().add(d, 'days').format('YYYY-MM-DD HH:mm:ss');


                db2.push(`Bots`, {
                    Token: token,
                    Owner: owner,
                    ClientID: client1.user.id,
                    Seller: config.MainGuild,
                    BotID: BotID,
                    Type: type,
                    Buyer: owner,
                    PurchasesID: purchasesID,
                    Node: NodeID,
                    Price: botPrice,
                    endTime: endTime,
                    startTime: startTime
                }).then(async () => {
                    prefixDB.set(`Prefix_${client1.user.id}`, prefix).then(async () => {
                        OwnerDB.set(`Owner_${client1.user.id}`, owner).then(async () => {
                            const commandsData = new Database(`/Json-Database/CommandsData/BotsCommands_${client1.user.id}.json`);
                            commandsData.set(`commands_${client1.user.id}`, botCommands)
                        }).then(async () => {
                            runDB.push(`RunBot`, client1.user.id).then(() => {
                                let logId = logsdb.get(`LogID`) || 1
                                logsdb.push(`Logs_${data.by}`, {
                                    id: logId,
                                    reason: `شراء ${type} بوت`,
                                    amount: botPrice,
                                    status: 'danger',
                                    action: 'خصم',
                                    date: moment().format('YYYY-MM-DD hh:mm'),
                                }).then(() => {
                                    logsdb.set(`LogID`, logId + 1)
                                })
                            })
                        })
                    })
                })


            }).catch(async error => {
                console.log(error)
                res.send({
                    data: {
                        alert: {
                            active: true,
                            type: 'error',
                            title: 'Error',
                            message: `Error occurred while creating the bot.`
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