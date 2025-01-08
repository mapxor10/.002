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
let commandstatusdb = new Database('/Json-Database/Others/CommandStatus.json')

let config = require("../../../config.json")
const client = require("../../..").client
module.exports = {
    name: `/bot/manage/commandstatus`,
    type: "post",
    run: async (req, res) => {
        let data = req.body

        if (data.action == "change") {
            if (data.status == false) {
                commandstatusdb.set(`Status_${data.bot}_${data.command}`, data.status)
            } else {
                commandstatusdb.delete(`Status_${data.bot}_${data.command}`)
            }
        }
    }
}

