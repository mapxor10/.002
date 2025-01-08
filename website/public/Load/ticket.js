const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const moment = require('moment');
const db = new Database("/Json-Database/DashBoard/UsersData.json");
let db2 = new Database('/Json-Database/Others/Tokens.json')
let db3 = new Database('/Json-Database/Others/BotMakerTokens.json')
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");

const Prices = new Database("/Json-Database/BotMaker/Prices.json");
let reviewsdb = new Database('/Json-Database/DashBoard/Reviews.json')
const cardsDB = new Database("/Json-Database/DashBoard/Cards.json");
const weblanguagedb = new Database("/Json-Database/DashBoard/Language.json");
const logsdb = new Database("/Json-Database/DashBoard/Logs.json");
// const blacklist = new Database("/Json-Database/DashBoard/Blacklisted");
const config = require('../../../config.json')
const client = require("../../../").client
module.exports = {
  name: `/ticket/:id/load`,
  type: "get",
  run: async (req, res) => {
    const balanceSchema = require('../../../Schema/Balance');
    const blacklistSchema = require('../../../Schema/Blacklist');
    delete require.cache[require.resolve(`../../html/EN/home.ejs`)];
    delete require.cache[require.resolve(`../../html/AR/home.ejs`)];
    let deecoded;
    try {
      deecoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch (e) { }

    let reviews = reviewsdb.get('reviews') || []
    let botCardsData = cardsDB.get(`DiscordBots`)?.filter(c => !c.mainServer || !c.mainServer == 'true')|| []
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
      if (!data) {
        res.clearCookie(`token`);
        res.redirect(`/`);
        return
      }

      if (req.cookies.token) {
        let Messages = []
        let ticketData = {}
        let ticketsGuild = client.guilds.cache.get(config.SupportSystem.guild)
        let ticketChannel = ticketsGuild?.channels.cache.get(req.params.id)
        if (!ticketChannel || ticketChannel.name != data.user.id  && !config.Developer.includes(data.user.id)) return res.end(`<script>window.location.href = "/tickets";</script>`);
        let ticketMessages = await ticketChannel.messages.fetch();
        ticketData.topic = ticketChannel.topic.split("=")[0]?.trim()
        ticketData.status = ticketChannel.topic.split("=")[1]?.trim()
        if(config.Developer.includes(data.user.id)) ticketData.support = 'true'
        else ticketData.support = 'false'
        
        ticketMessages.filter((m) => {
          Messages.push(
            {
              userName: m.embeds[0].data.fields[0].value,
              userID: m.embeds[0].data.fields[1].value,
              content: m.embeds[0].data.description,
              date: moment(m.createdTimestamp).format('YYYY-MM-DD hh:mm'),
            }
          )
        });

        let usercoins = 0
        if (Object.keys(balanceSchema).length > 0) {
            let userdata = await balanceSchema.findOne({ userid: data.user.id, guild: config.MainGuild })
            usercoins = userdata?.balance || 0
        }

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
            userCoins: usercoins,
            language: language,
            ticket: {
              messages: Messages,
              ticketData: ticketData
            },
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
      if (Object.keys(blacklistSchema).length > 0) {
        let checkblacklist = await blacklistSchema.findOne({ userid: data.user.id })
        if (checkblacklist) {
          return res.end(`<script>window.location.href = "/";</script>`);
        }
      }
      res.render(`./website/html/Pages/Dashboard/Support/ticket.ejs`, args);
    } else {
      return res.end(`<script>window.location.href = "/";</script>`);
    }
  }
}