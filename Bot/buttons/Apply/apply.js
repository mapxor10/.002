const {
    Client,
    Collection,
    Discord,
    createInvite,
    ChannelType,
    WebhookClient,
    PermissionFlagsBits,
    GatewayIntentBits,
    Partials,
    ApplicationCommandType,
    ApplicationCommandOptionType,
    Events,
    StringSelectMenuBuilder,
    ChannelSelectMenuBuilder,
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
    RoleSelectMenuBuilder,
    ChatInputCommandInteraction,
} = require("discord.js");
const { Database } = require("st.db")
const db = new Database("./Bot/Json-Database/Settings/Apply.json")

module.exports = {
    name: "apply",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: false,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    run: async (client, interaction, language, reply, replyEmbeds, name) => {
        try {
            let check = db.get("Applied_" + interaction.message.id + "_" + client.user.id) || []
            if (check.includes(interaction.user.id))
                return interaction.reply({ content: reply.Apply.Reply17, ephemeral: true, allowedMentions: { repliedUser: false } })
            let status = db.get("applectionStatus_" + interaction.message.id + "_" + client.user.id) || "on"
            if (status == "off")
                return interaction.reply({ content: reply.Apply.Reply18, ephemeral: true, allowedMentions: { repliedUser: false } })

            const requests = interaction.customId.split("_")[0].trim()
            const role = interaction.customId.split("_")[1].trim()
            let appData = db.get("appData_" + interaction.message.id + "_" + client.user.id) || null
            if (!appData) return interaction.reply({ content: reply.Errors.Reply1.replace("[COMMAND]", "button"), ephemeral: true, allowedMentions: { repliedUser: false } })

            const modal = new ModalBuilder()
                .setCustomId(requests + "_" + role + "_apply")
                .setTitle(reply.Apply.Asks.t);

            let ask1 = new TextInputBuilder()
                .setCustomId('ask1')
                .setRequired(true)
                .setLabel(appData.ask1)
                .setStyle(TextInputStyle.Short);;

            let ask2 = null;
            let ask3 = null;
            let ask4 = null;
            let ask5 = null;

            if (appData.ask2) {
                ask2 = new TextInputBuilder()
                    .setCustomId('ask2')
                    .setRequired(true)
                    .setLabel(appData.ask2)
                    .setStyle(TextInputStyle.Short);
            }
            if (appData.ask3) {
                ask3 = new TextInputBuilder()
                    .setCustomId('ask3')
                    .setRequired(true)
                    .setLabel(appData.ask3)
                    .setStyle(TextInputStyle.Short);
            }
            if (appData.ask4) {
                ask4 = new TextInputBuilder()
                    .setCustomId('ask4')
                    .setRequired(true)
                    .setLabel(appData.ask4)
                    .setStyle(TextInputStyle.Short);
            }
            if (appData.ask5) {
                ask5 = new TextInputBuilder()
                    .setCustomId('ask5')
                    .setRequired(true)
                    .setLabel(appData.ask5)
                    .setStyle(TextInputStyle.Short);
            }

            let asks = []
            let the_ask1 = new ActionRowBuilder().addComponents(ask1);
            asks.push(the_ask1)
            if (ask2) {
                let the_ask2 = new ActionRowBuilder().addComponents(ask2);
                asks.push(the_ask2)
            }
            if (ask3) {
                let the_ask3 = new ActionRowBuilder().addComponents(ask3);
                asks.push(the_ask3)
            }
            if (ask4) {
                let the_ask4 = new ActionRowBuilder().addComponents(ask4);
                asks.push(the_ask4)
            }
            if (ask5) {
                let the_ask5 = new ActionRowBuilder().addComponents(ask5);
                asks.push(the_ask5)
            }


            modal.addComponents(...asks);

            await interaction.showModal(modal);
        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    }
}
