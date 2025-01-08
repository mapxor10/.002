const {
    Client,
    Collection,
    Discord,
    createInvite,
    ChannelType,
    WebhookClient,
    PermissionsBitField,
    GatewayIntentBits,
    Partials,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    Events,
    StringSelectMenuBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ContextMenuCommandBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    GatewayCloseCodes,
    ButtonStyle,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Embed,
    AttachmentBuilder,
    ChatInputCommandInteraction
} = require("discord.js");
const { Database } = require("st.db");
const fs = require('fs')
let base64ToImage = require('base64-to-image');
const db = new Database("/Json-Database/DashBoard/Language.json");

const client = require("../../..").client
module.exports = {
    name: `/language`,
    type: "post",
    run: async (req, res) => {
        let data = req.body
        if(data.user){
            await db.set(`${data.user}`, data.language)
        }
        if(req.ip){
            await db.set(`${req.ip}`, data.language)
        }
    }
}