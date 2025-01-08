const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const moment = require('moment');
const db = new Database("/Json-Database/DashBoard/UsersData.json");
let db2 = new Database('/Json-Database/Others/Tokens.json')
let db3 = new Database('/Json-Database/Others/BotMakerTokens.json')
let aliasesdb = new Database('/Json-Database/Others/Aliases.json')
let botlanguagedb = new Database('/Json-Database/Others/Language.json')
const messages = new Database("./Bot/messages.json");
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
    name: `/bot/control/settings/tax/:id/:id/load`,
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
                const botLanguage = await botlanguagedb.get(id) || "EN"
                const reply = await messages.get(botLanguage)
                let botData = new Database("../Bot/Json-Database/Settings/Tax.json")
                let systemChannels = botData.get("Tax_" + serverId + "_" + id) || []
                let channelsFiltered = []

                let line = botData.get("TaxLine_" + serverId + "_" + id)
                let taxMessage = botData.get("TaxMessage_" + serverId + "_" + id) || reply.Tax.Reply7;
                let taxType = botData.get("taxType_" + serverId + "_" + id) || 'message';
                let taxButton = botData.get("TaxButton_" + serverId + "_" + id) || null
                localBotsData.servers.filter(s => s.id == serverId)[0].channels.forEach(channel => {
                    if (channel.type == 4) return
                    if (!systemChannels.includes(channel.id)) {
                        if (channel.type == 0) channel.type = "Guild Text"
                        else return
                        channel.action = "add"
                        channelsFiltered.push(channel)
                    } else {
                        if (channel.type == 0) channel.type = "Guild Text"
                        else return
                        channel.action = "remove"
                        channelsFiltered.push(channel)
                    }
                })

                botConfigData.channels = channelsFiltered
                botConfigData.line = line
                botConfigData.taxMessage = taxMessage
                botConfigData.taxButton = taxButton
                botConfigData.taxType = taxType


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
            res.render(`./website/html/Pages/Control/Tax.ejs`, args);
        } else {
            return res.end(`<script>window.location.href = "/";</script>`);
        }
    }
}