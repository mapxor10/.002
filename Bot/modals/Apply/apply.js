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
    Message,
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
    PermissionOverwriteManager,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction
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
            if(check.includes(interaction.user.id))
             return interaction.reply({content: reply.Apply.Reply17 , ephemeral: true, allowedMentions: { repliedUser: false } })
            
            const requests = interaction.customId.split("_")[0].trim()
            const role = interaction.customId.split("_")[1].trim()

            let appData = db.get("appData_" + interaction.message.id + "_" + client.user.id)
            if (!appData) return interaction.reply({ content: reply.Errors.Reply1.replace("[COMMAND]", "modal"), ephemeral: true, allowedMentions: { repliedUser: false } })

            let requestsChannel = interaction.guild.channels.cache.get(requests)
            if (!requestsChannel)
                return interaction.reply({ content: reply.Apply.Reply10, ephemeral: true, allowedMentions: { repliedUser: false } })


            let fields = interaction.fields.components.length

            let asks = []
            asks.push({ qes: appData.ask1, ans: interaction.fields.getTextInputValue("ask1") })

            if (fields >= 2) {
                asks.push({ qes: appData.ask2, ans: interaction.fields.getTextInputValue("ask2") })
            }

            if (fields >= 3) {
                asks.push({ qes: appData.ask3, ans: interaction.fields.getTextInputValue("ask3") })
            }
            if (fields >= 4) {
                asks.push({ qes: appData.ask4, ans: interaction.fields.getTextInputValue("ask4") })
            }
            if (fields == 5) {
                asks.push({ qes: appData.ask5, ans: interaction.fields.getTextInputValue("ask5") })
            }

            let msg = await interaction.reply({ content: reply.Others.Reply19, ephemeral: true })

            let qess = []
            asks.forEach((ask) => {
                qess.push({ name: "- " + ask.qes, value: "> " + ask.ans })
            });


            const embed = new EmbedBuilder()
                .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setColor("Blue")
                .setTimestamp()
                .setDescription(reply.Apply.Reply13.replace("[AUTHOR]", interaction.user).replace("[ROLE]", "<@&" + role + ">"))
                .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .addFields(...qess)

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(interaction.user.id + "_" + role + "_accept")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Accept"),
                    new ButtonBuilder()
                        .setCustomId(interaction.user.id + "_" + role + "_reject")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Reject"),
                );

            requestsChannel.send({ embeds: [embed], components: [buttons] }).then(() => {
                msg.edit({ content: reply.Apply.Reply14 }).catch()
                db.push("Applied_" + interaction.message.id + "_" + client.user.id, interaction.user.id)
            })

        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } }).catch(() => {
                return interaction.channel.send({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
            })
        }
    }
}