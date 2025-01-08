const jwt = require(`jsonwebtoken`);
const jwt_secret = `Arabs-Dashhbooard-Seeeec-566604399523266580-Deves`;
const { Database } = require("st.db");
const db = new Database("/Json-Database/DashBoard/UsersData.json");

module.exports = {
    name: `/login`,
    type: "get",
    run: async (req, res) => {
        const url = process.oauth.generateAuthUrl({
            scope: [`identify`, `guilds.join`],
            state: require(`crypto`).randomBytes(16).toString(`hex`),
        });
        res.clearCookie(`token`);
        if(req.cookies.token && req.cookies.token.length > 0){
            let deecoded;
            try {
                deecoded = jwt.verify(req.cookies.token, jwt_secret);
            } catch (e) {
                return res.redirect(`/login`);
            }
            if(!deecoded) return res.redirect(url);
            let data = db.get("10") || null
            if(!data) res.redirect(url);
            if(data) {
                if((Data.now() - data.lastUpdated) > data.expires_in * 1000){
                    const oauthData = process.oauth.tokenRequest({
                        refreshToken: data.refresh_token,
                        grantType: "refresh_token",
                        scope: ["identify", `guilds.join`]
                    });
                }
                res.redirect(`/`);
            }
        } else res.redirect(url);
    }
}