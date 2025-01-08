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
    name: `/bot/control/settings/log/:id/:id/load`,
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
                let botData = new Database("../Bot/Json-Database/Systems/Log.json")
                let botConfig = require("../../../../Bot/config.json")
                let localBotsData = localData.get(`data_${id}`)
                botType = localBotsData.type

                let botConfigData = {}
                let channelsFiltered = []
                let rolessFiltered = []

                let logData = {}
                botConfig.Systems.Log.Logging.forEach(l => {
                    let ss = db.get(`${l.value}_${serverId}_${id}`) || { channel: null, color: "#57f288" }
                    logData[l.value] = { channel: ss.channel, color: ss.color }
                })

                localBotsData.servers.filter(s => s.id == serverId)[0].channels.forEach(channel => {
                    if (channel.type == 0) {
                        channelsFiltered.push(channel)
                    }
                })
                localBotsData.servers.filter(s => s.id == serverId)[0].roles.forEach(role => {
                    rolessFiltered.push(role)
                })

                botConfigData.channels = channelsFiltered
                botConfigData.logsEvents = botConfig.Systems.Log.Logging
                botConfigData.logsData = logData


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
            res.render(`./website/html/Pages/Control/Log.ejs`, args);
        } else {
            return res.end(`<script>window.location.href = "/";</script>`);
        }
    }
}