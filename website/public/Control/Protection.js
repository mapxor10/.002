const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const moment = require('moment');
const db = new Database("/Json-Database/DashBoard/UsersData.json");
let db2 = new Database('/Json-Database/Others/Tokens.json')
let db3 = new Database('/Json-Database/Others/BotMakerTokens.json')
let aliasesdb = new Database('/Json-Database/Others/Aliases.json')
let botlanguagedb = new Database('/Json-Database/Others/Language.json')
const ownerDB = new Database("/Json-Database/Others/OwnerData");
const prefixDB = new Database("/Json-Database/Others/PrefixData.json");
const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
let reviewsdb = new Database('/Json-Database/DashBoard/Reviews.json')
const cardsDB = new Database("/Json-Database/DashBoard/Cards.json");
const weblanguagedb = new Database("/Json-Database/DashBoard/Language.json");
const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

const config = require('../../../config.json')

module.exports = {
    name: `/bot/control/settings/protection/:id/:id/load`,
    type: "get",
    run: async (req, res) => {
        delete require.cache[require.resolve(`../../html/EN/home.ejs`)];
        delete require.cache[require.resolve(`../../html/AR/home.ejs`)];
        let deecoded;
        try {
            deecoded = jwt.verify(req.cookies.token, jwt_secret);
        } catch (e) { }
        let reviews = reviewsdb.get('reviews') || []
        let botCardsData = cardsDB.get(`DiscordBots`) || []
        let botCards = []
        botCardsData.forEach((card, i) => {
            if (i + 1 > 4) return
            let p = Prices.get(`${card.name}P_${config.MainGuild}`) || 10
            card.price = p
            botCards.push(
                {
                    ...card
                }
            )
        })
        let language;
        let languagedb = weblanguagedb.get(`${req.ip}`) || "EN"
        language = languagedb
        let args = {
            orderCards: {
                Discord: botCards
            },
            data: {
                reviews: reviews,
                language: language,
                login: false,
            },
        }
        let botType = null
        if (deecoded) {
            let data = db.get(deecoded.uuid) || null
            if (!data) {
                res.clearCookie(`token`);
                res.redirect(`/`);
                return
            }
            if (req.cookies.token) {
                let id = req.url.split("/")[5]?.trim()
                let serverId = req.params.id
                const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${id}.json`);
                let localBotsData = localData.get(`data_${id}`)
                botType = localBotsData.type

                let botConfigData = {}
                let botData = new Database("../Bot/Json-Database/Settings/Protection.json")
                let whiteListedUsers = botData.all().filter(d => d.ID.startsWith("whiteList_" + serverId + "_") && d.ID.endsWith(id))
                let protectionLog = botData.get("actionLimit_" + "_" + serverId + "_" + id) || null

                let banLimit = botData.get("actionLimit_" + "ban_" + serverId + "_" + id) || 5
                let kickLimit = botData.get("actionLimit_" + "kick_" + serverId + "_" + id) || 5
                let deleteRolesLimit = botData.get("actionLimit_" + "delete_roles_" + serverId + "_" + id) || 5
                let createRolesLimit = botData.get("actionLimit_" + "create_roles_" + serverId + "_" + id) || 5
                let deleteChannelLimit = botData.get("actionLimit_" + "delete_channel_" + serverId + "_" + id) || 5
                let createChannelLimit = botData.get("actionLimit_" + "create_channel_" + serverId + "_" + id) || 5
                let addBotsLimit = botData.get("actionLimit_" + "add_bots_" + serverId + "_" + id) || 3

                let banAutomode = botData.get("autoMode_" + "ban_" + serverId + "_" + id) || "delete_roles"
                let kickAutomode = botData.get("autoMode_" + "kick_" + serverId + "_" + id) || "delete_roles"
                let deleteRolesAutomode = botData.get("autoMode_" + "delete_roles_" + serverId + "_" + id) || "delete_roles"
                let createRolesAutomode = botData.get("autoMode_" + "create_roles_" + serverId + "_" + id) || "delete_roles"
                let deleteChannelAutomode = botData.get("autoMode_" + "delete_channel_" + serverId + "_" + id) || "delete_roles"
                let createChannelAutomode = botData.get("autoMode_" + "create_channel_" + serverId + "_" + id) || "delete_roles"
                let addBotsAutomode = botData.get("autoMode_" + "add_bots_" + serverId + "_" + id) || "delete_roles"

                let channelsFiltered = []
                let allWhiteListed = []
                let banWhiteListed = []
                let kickWhiteListed = []
                let deleteRolesWhiteListed = []
                let createRolesWhiteListed = []
                let deleteChannelsWhiteListed = []
                let createChannelsWhiteListed = []
                let addBotslsWhiteListed = []

                whiteListedUsers.forEach(user => {
                    let userID = user.ID.split("_")[2]?.trim()
                    if (user.data.includes("all")) {
                        allWhiteListed.push(userID)
                    }
                    if (user.data.includes("ban")) {
                        banWhiteListed.push(userID)
                    }
                    if (user.data.includes("kick")) {
                        kickWhiteListed.push(userID)
                    }
                    if (user.data.includes("delete_roles")) {
                        deleteRolesWhiteListed.push(userID)
                    }
                    if (user.data.includes("create_roles")) {
                        createRolesWhiteListed.push(userID)
                    }
                    if (user.data.includes("delete_channel")) {
                        deleteChannelsWhiteListed.push(userID)
                    }
                    if (user.data.includes("create_channel")) {
                        createChannelsWhiteListed.push(userID)
                    }
                    if (user.data.includes("add_bots")) {
                        addBotslsWhiteListed.push(userID)
                    }
                })

                localBotsData.servers.filter(s => s.id == serverId)[0].channels.forEach(channel => {
                    if (channel.type == 0 || channel.type == "Guild Text") {
                        channelsFiltered.push(channel)
                    }
                })



                botConfigData.channels = channelsFiltered

                botConfigData.allWhiteListed = allWhiteListed
                botConfigData.banWhiteListed = banWhiteListed
                botConfigData.kickWhiteListed = kickWhiteListed
                botConfigData.deleteRolesWhiteListed = deleteRolesWhiteListed
                botConfigData.createRolesWhiteListed = createRolesWhiteListed
                botConfigData.deleteChannelsWhiteListed = deleteChannelsWhiteListed
                botConfigData.createChannelLimit = createChannelLimit
                botConfigData.addBotslsWhiteListed = addBotslsWhiteListed
                botConfigData.protectionLog = protectionLog


                botConfigData.banLimit = banLimit
                botConfigData.kickLimit = kickLimit
                botConfigData.deleteRolesLimit = deleteRolesLimit
                botConfigData.createRolesLimit = createRolesLimit
                botConfigData.deleteChannelLimit = deleteChannelLimit
                botConfigData.createChannelLimit = createChannelLimit
                botConfigData.addBotsLimit = addBotsLimit

                botConfigData.banAutomode = banAutomode
                botConfigData.kickAutomode = kickAutomode
                botConfigData.deleteRolesAutomode = deleteRolesAutomode
                botConfigData.createRolesAutomode = createRolesAutomode
                botConfigData.deleteChannelAutomode = deleteChannelAutomode
                botConfigData.createChannelAutomode = createChannelAutomode
                botConfigData.addBotsAutomode = addBotsAutomode



                let botCardsData = cardsDB.get(`DiscordBots`) || []
                let botCards = []
                botCardsData.forEach(card => {
                    let p = Prices.get(`${card.name}P_${config.MainGuild}`) || 10
                    card.price = p
                    botCards.push(
                        {
                            ...card
                        }
                    )
                })

                let userlanguagedb = weblanguagedb.get(`${data.user.id}`) || "EN"
                language = userlanguagedb
                args = {
                    user: {
                        avatar: `${data.user.avatar}`,
                        username: data.user.username,
                        discriminator: data.user.discriminator,
                        id: data.user.id,
                    },
                    orderCards: {
                        Discord: botCards
                    },
                    data: {
                        reviews: reviews,
                        login: true,
                        language: language,
                        botConfigData: botConfigData,
                        page: {
                            pageName: req.url.replace("/", ''),
                            view: req.url,
                            data: {}
                        },
                    },
                    system: {
                        logs: logsdb.get(`Logs_${data.user.id}`)?.reverse() || []
                    }
                }
            }
            res.render(`./website/html/Pages/Control/Protection.ejs`, args);
        } else {
            return res.end(`<script>window.location.href = "/";</script>`);
        }
    }
}