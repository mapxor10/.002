module.exports = {
    name: `/logout`,
    type: "get",
    run: async (req, res) => {
        res.clearCookie(`token`);
        res.redirect(`/`);
    }
}