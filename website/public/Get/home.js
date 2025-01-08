const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const { LocalStorage } = require('node-localstorage');


const db = new Database("/Json-Database/DashBoard/UsersData.json");
const cardsDB = new Database("/Json-Database/DashBoard/Cards.json");
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
let reviewsdb = new Database('/Json-Database/DashBoard/Reviews.json')
const weblanguagedb = new Database("/Json-Database/DashBoard/Language.json");
const config = require('../../../config.json')
// const blacklist = new Database("/Json-Database/DashBoard/Blacklisted");

let client = require("../../..").client
module.exports = {
    name: `/`,
    type: "get",
    run: async (req, res) => {
        const blacklistSchema = require('../../../Schema/Blacklist');
        delete require.cache[require.resolve(`../../html/EN/home.ejs`)];
        delete require.cache[require.resolve(`../../html/AR/home.ejs`)];
        let deecoded;
        try {
            deecoded = jwt.verify(req.cookies.token, jwt_secret);
        } catch (e) { }
        let reviews = reviewsdb.get('reviews') || []
        let botCardsData = cardsDB.get(`DiscordBots`)?.filter(c => !c.mainServer || !c.mainServer == 'true') || []
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

        if (deecoded) {
            let data = db.get(deecoded.uuid) || null
            if (req.cookies.token) {
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
                        language: language,
                        login: true,
                    },
                    system: {
                    }
                }
            }
            let blacklisted = false
            if (Object.keys(blacklistSchema).length > 0) {
                let checkblacklist = await blacklistSchema.findOne({ userid: data.user.id })
                if (checkblacklist) {
                    blacklisted = true
                }
            }
            if (blacklisted == true) {
                if (language == "EN") {
                    return res.render(`./website/html/EN/blacklist.ejs`, args);
                } else {
                    return res.render(`./website/html/AR/blacklist.ejs`, args);
                }
            } else {
                if (language == "EN") {
                    res.render(`./website/html/EN/home.ejs`, args);
                } else {
                    res.render(`./website/html/AR/home.ejs`, args);
                }
            }
        } else {
            if (language == "EN") {
                res.render(`./website/html/EN/home.ejs`, args);
            } else {
                res.render(`./website/html/AR/home.ejs`, args);
            }
        }
    }
}