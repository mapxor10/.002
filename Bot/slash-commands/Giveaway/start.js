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
const db = new Database("./Bot/Json-Database/Settings/Giveaway.json")
const moment = require('moment-timezone');
const ms = require("ms");
const isImageUrl = require('is-image-url');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gstart')
        .setDescription('Start new giveaway.')
        .addStringOption(time => time
            .setName("time")
            .setDescription("The duration of giveaway.")
            .setRequired(true))
        .addIntegerOption(winners => winners
            .setName("winners")
            .setDescription("Number of the winners.")
            .setRequired(true))
        .addStringOption(prize => prize
            .setName("prize")
            .setDescription("The giveaway prize.")
            .setRequired(true))
        .addStringOption(img => img
            .setName("image")
            .setDescription("Add a big image to giveaway."))
        .addStringOption(img => img
            .setName("thumbnail")
            .setDescription("Add a small image to giveaway."))
    ,
    type: "Giveaway",
    botP: [],
    userP: [PermissionFlagsBits.Administrator],
    P: "Administrator"
    ,
    support: false,
    ownerOnly: false,
    /**
* @param {ChatInputCommandInteraction} interaction
*/
    async run(client, interaction, language, reply, replyEmbeds, name) {
        try {
            const time = interaction.options.getString("time")
            const winners = interaction.options.getInteger("winners")
            const prize = interaction.options.getString("prize")
            const image = interaction.options.getString("image")
            const thumbnail = interaction.options.getString("thumbnail")

            const hasTimeUnit = /[mdhs]/i.test(time);
            if (!hasTimeUnit) return interaction.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
            const remainingTimeSeconds = ms(time) / 1000;
      
            const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
            const endTimemomet = moment().add(remainingTimeSeconds, 'seconds').format('YYYY-MM-DD HH:mm:ss');

            const giveawayEmbed = new EmbedBuilder()
            .setColor(interaction.guild.members.me.displayHexColor)
            .setTitle(prize)
            .setDescription(`Ends: <t:${Math.floor((Date.now() + ms(time)) / 1000)}:R>  (<t:${Math.floor((Date.now() + ms(time)) / 1000)}:f>)\nHosted by: ${interaction.user}\nEntries: **0**\nWinners: **${winners}**`)
    
            let gmsg = await interaction.reply({content: reply.Giveaway.Reply6, ephemeral: true, allowedMentions: { repliedUser: false } })
            if (image && isImageUrl(image)) {
                giveawayEmbed.setImage(image)
            }
            if (thumbnail && isImageUrl(thumbnail)) {
                giveawayEmbed.setThumbnail(thumbnail)
            }
          const emoji = db.get(`gemoji_${interaction.guild.id}`) || "🎉"
    
          const GiveawayButton = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
              .setCustomId(`giveaway`)
              .setStyle(ButtonStyle.Primary)
              .setEmoji(`${emoji}`)
              .setDisabled(false),
          ]);

          interaction.channel.send({ embeds: [giveawayEmbed], components: [GiveawayButton] }).then(async (msg) => {
              await db.push(`RunningGiveaway_${client.user.id}`, {
                Time: endTimemomet,
                RealEndsTime: endTimemomet,
                StartedTime: startTime,
                messageID: msg.id,
                Status: "true",
                channelID: interaction.channel.id,
                guild: interaction.guild.id,
                Winners: winners,
                Reroll: [],
                winner: "null",
                Pause: "false",
                Started: "false",
                Channel: interaction.channel.id,
                Prize: prize,
                Ended: "false"
              }).then(() =>{
                gmsg.edit({content: reply.Giveaway.Reply7.replace("[ID]", msg.id)})
              })
            });

        } catch (error) {
            console.log(error)
            return interaction.channel.send({ embeds: [replyEmbeds.errorEmbed], ephemeral: true, allowedMentions: { repliedUser: false } })
        }
    },
};