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
module.exports = {
  name: `/manage/subscription`,
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
        let userSubscriptions = []
        let subscriptionsData = db3.all()
        let subscriptionsToFetch = subscriptionsData[0]?.data.filter(bots => bots.Owner == data.user.id) || []
        if (config.Developer.includes(data.user.id))subscriptionsToFetch = subscriptionsData[0]?.data
        if (subscriptionsToFetch?.length) {
          subscriptionsToFetch.forEach(async (bot) => {
            const startTime = moment(bot.startTime);
            const endTime = moment(bot.endTime);
            const currentTime = moment();
            const diffInSeconds1 = endTime.diff(startTime, 'seconds');
            const diffInSeconds2 = currentTime.diff(startTime, 'seconds');
            const percentage = ((diffInSeconds1 - diffInSeconds2) / diffInSeconds1) * 100;
            const timeDiff = endTime - currentTime;
            const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

            const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${bot.ID}.json`);
            let localBotsData = localData.get(`data_${bot.ID}`)
            let status = "ONLINE";
            let avatar = `https://cdn.discordapp.com/avatars/${localBotsData?.id}/${localBotsData?.avatar}.png`;
            let text = ``;
            if (daysLeft) text = `${daysLeft} Day`
            else if (hoursLeft) text = `${hoursLeft} Hour`
            else if (minutesLeft) text = `${minutesLeft} Min`
            else if (secondsLeft) text = `${secondsLeft} Sec`
            if (!localBotsData || localBotsData && !localBotsData?.name) status = "OFFLINE"
            if (!localBotsData || localBotsData && !localBotsData?.avatar) avatar = "https://cdn.discordapp.com/embed/avatars/0.png"
            userSubscriptions.push(
              {
                avatar: avatar,
                name: localBotsData?.name || "Arabs",
                id: localBotsData?.id,
                owner: bot.Owner,
                owned: bot?.owned || "false",
                subscription: {
                  progress: `${percentage}%`,
                  text: text
                },
                status: status,
                type: bot.type,
                price: bot.price || '-',
                renew: Math.floor((bot.Price || 5000) * (1 - 0.25))
              }
            )
          })
        }
        
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
            userSubscriptions: userSubscriptions,
            userCoins: usercoins,
            language: language,
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
      let blacklisted = false
      if (Object.keys(blacklistSchema).length > 0) {
          let checkblacklist = await blacklistSchema.findOne({ userid: data.user.id})
          if(checkblacklist){
            blacklisted = true
          }
      }
      if (blacklisted == true) {
        if (language == "EN") {
          return res.render(`./website/html/EN/blacklist.ejs`, args);
        } else {
          return res.render(`./website/html/AR/blacklist.ejs`, args);
        }
      }else{
        if (language == "EN") {
          res.render(`./website/html/EN/dashboard.ejs`, args);
        } else {
          res.render(`./website/html/AR/dashboard.ejs`, args);
        }
      }
    } else {
      return res.end(`<script>window.location.href = "/login";</script>`);
    }
  }
}