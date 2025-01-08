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
    ChatInputCommandInteraction
} = require("discord.js");
const { Database } = require("st.db")
const db = new Database("./Bot/Json-Database/Settings/Ticket.json")
const db2 = new Database("./Bot/Json-Database/Settings/TempTicket.json")

module.exports = {
    name: "requester-remove",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: false,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    run: async (client, interaction, language, reply, replyEmbeds, name) => {
        try {
            const requester = interaction.customId.split("_")[0].trim();
            let claimer = db2.get(interaction.channel.id + "_claimed")

            if (claimer && interaction.user.id != claimer && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) 
            return interaction.reply({ content: reply.Ticket.Reply40, ephemeral: true })

            interaction.deferUpdate();

            const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setDescription(interaction.message.embeds[0].description)

            const Requestbuttons = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId(requester + "_request-accept")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Accept")
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId(requester + "_request-reject")
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel("Reject")
                    .setDisabled(true),
                    new ButtonBuilder()
                        .setCustomId(requester + "_requester-remove")
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Remove")
                        .setDisabled(true),
            ]);
            interaction.message.edit({embeds: [embed], components: [Requestbuttons] }).then(() =>{
                interaction.channel.permissionOverwrites.edit(requester, { SendMessages: null, });
            })

        } catch (error) {
            console.log(error)
            return interaction.reply({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    }
}
