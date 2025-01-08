const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const db = new Database("/Json-Database/DashBoard/UsersData.json");
const authdb = new Database("/Json-Database/DashBoard/Auth2Data.json");
const config = require("../../../config.json");
const { EmbedBuilder } = require("discord.js");
const client = require("../../../").client
module.exports = {
    name: `/callback`,
    type: "get",
    run: async (req, res) => {
        let log = client.channels.cache.get(config.adminChannel)
        if(!req.query.code) res.redirect(`/login`);
        let oauthData;
        try {
            oauthData = await process.oauth.tokenRequest({
                code: req.query.code,
                scope: [`identify`, `guilds.join`],
                grantType: `authorization_code`,
            });
        }  catch (e) {}
        if(!oauthData) return res.redirect(`/login`);
        const user = await process.oauth.getUser(oauthData.access_token);
        if(log){
            let embed = new EmbedBuilder()
            .setColor('DarkButNotBlack')
            .setTitle("New login")
            .setDescription(`User: <@!${user.id}>`)
            log.send({embeds: [embed]})
        }
        let data = db.get(user.id) || null
        let avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        if(!user.avatar) avatar = "https://cdn.discordapp.com/embed/avatars/0.png"
        if(!data || data) data = db.set(user.id,{
            user: {
                avatar: avatar,
                username: user.username,
                discriminator: user.discriminator,
                id: user.id,
                email: user.email,
                access_token:oauthData.access_token,
            },
            data:{
                login: true,
            }
        }).then(() =>{
            authdb.set(user.id,{
                access_token: oauthData.access_token,
                id: user.id,
            })
        })
        data.access_token = oauthData.access_token;
        data.refresh_token = oauthData.refresh_token;
        data.expires_in = oauthData.expires_in;
        data.secretAccessKey = jwt.sign({
            userID: user.id,
            uuid: user.id
        }, jwt_secret);
        data.user = {
            id: user.id,
            username: user.username,
            discriminator: user.discriminator, 
            avatar: user.avatar,
            email: user.email,
        }
        res.cookie(`token`, data.secretAccessKey, { maxAge: 259200000 });
        res.end(`<script>window.location.href = "/";</script>`);
    }
}