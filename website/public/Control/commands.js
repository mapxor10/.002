const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const moment = require('moment');
const db = new Database("/Json-Database/DashBoard/UsersData.json");
let db2 = new Database('/Json-Database/Others/Tokens.json')
let db3 = new Database('/Json-Database/Others/BotMakerTokens.json')
let aliasesdb = new Database('/Json-Database/Others/Aliases.json')
let commandstatusdb = new Database('/Json-Database/Others/CommandStatus.json')
let enablechannelsdb = new Database('/Json-Database/Others/EnableChannels.json')
let botlanguagedb = new Database('/Json-Database/Others/Language.json')
const ownerDB = new Database("/Json-Database/Others/OwnerData");
const prefixDB = new Database("/Json-Database/Others/PrefixData.json");
// const coinsDB = new Database("/Json-Database/BotMaker/Balance.json");
const balanceSchema = require('../../../Schema/Balance');
const Prices = new Database("/Json-Database/BotMaker/Prices.json");
let reviewsdb = new Database('/Json-Database/DashBoard/Reviews.json')
const cardsDB = new Database("/Json-Database/DashBoard/Cards.json");
const weblanguagedb = new Database("/Json-Database/DashBoard/Language.json");
const logsdb = new Database("/Json-Database/DashBoard/Logs.json");

const config = require('../../../config.json')

module.exports = {
  name: `/control/bot/commands/:id/:id/load`,
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
        let id = req.url.split("/")[4]?.trim()
        let serverId = req.params.id

        const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${id}.json`);
        let localBotsData = localData.get(`data_${id}`)
        botType = localBotsData?.type
        let avatar = `https://cdn.discordapp.com/avatars/${localBotsData?.id}/${localBotsData?.avatar}.png`;
        if (!localBotsData || localBotsData && !localBotsData?.avatar) avatar = "https://cdn.discordapp.com/embed/avatars/0.png"

        let botConfigData = {}
        let channelsFiltered = []
        localBotsData.servers.filter(s => s.id == serverId)[0].channels.forEach(channel => {
          if (channel.type == 0 || channel.type == "Guild Text") {
            channelsFiltered.push(channel)
          }
        })
        botConfigData.channels = channelsFiltered

        const commandsData = new Database(`/Json-Database/CommandsData/BotsCommands_${id}.json`);
        let botCommandsData = commandsData.get(`commands_${id}`)?.filter(com => com.type != `Config` && com.prefix == true) || []
        let botCommands = []
        let commandAliases = aliasesdb.all().filter(d => d.ID.split("_")[1]?.trim() == id)

        
        let botLanguage = botlanguagedb.get(`${id}`) || 'EN'
        let botOwner = ownerDB.get(`Owner_${id}`) || '000'
        let botPrefix = prefixDB.get(`Prefix_${id}`) || '!'
        if (botCommandsData.length) {
          botCommandsData.forEach((com) => {
            let enableChannels = enablechannelsdb.get(`Enable_${com.prefix_commandName}_${id}_${serverId}`) || []
            let ali = []
            let eblsch = []
            commandAliases.forEach((Aliase) => {
              if (Aliase.data == com.prefix_commandName) {
                ali.push(Aliase.ID.split("_")[0]?.trim())
              }
            })
            enableChannels.forEach(ch => {
              channelsFiltered.filter(c => {
                if(c.id == ch)
                {
                  eblsch.push(c)
                }
              })
            });
            let commandstatus = commandstatusdb.get(`Status_${id}_${com.prefix_commandName}`)
            botCommands.push(
              {
                name: com.prefix_commandName,
                description: com.description,
                type: com.type,
                aliases: ali,
                enabledchannels: eblsch,
                status: commandstatus,
              }
            )
          })
        }

        let userdata = await balanceSchema.findOne({ userid: data.user.id, guild: config.MainGuild })
        let usercoins = userdata?.balance || 0;

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
          botManage: {
            avatar: avatar,
            name: localBotsData?.name || "Super",
            id: localBotsData?.id,
            renew: Math.floor((localBotsData?.price || 5000) * (1 - 0.25)),
            commands: botCommands,
            botLanguage: botLanguage,
            botOwner: botOwner,
            botPrefix: botPrefix,
            type: localBotsData.type,
            node: localBotsData.node,
            price: localBotsData.price,
            botServers: localBotsData.servers,
          },
          serverId: serverId,
          orderCards: {
            Discord: botCards
          },
          data: {
            reviews: reviews,
            login: true,
            userCoins: usercoins,
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
      res.render(`./website/html/Pages/Control/commands.ejs`, args);
    } else {
      return res.end(`<script>window.location.href = "/";</script>`);
    }
  }
}