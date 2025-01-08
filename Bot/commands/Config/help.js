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
} = require("discord.js");
const { Database } = require("st.db")
const prefixdb = new Database("/Json-Database/Others/PrefixData.json");
const ownerdb = new Database("/Json-Database/Others/OwnerData.json");
module.exports = {
    name: "help",
    type: "Config",
    botP: [],
    userP: [],
    P: "",
    ownerOnly: false,
    /**
* @param {Message} message
*/
    run: async (client, message, args, language, reply, replyEmbeds, name, helpCommands) => {
        try {
            if (args[0] && !replyEmbeds) {
                return
            } else if (args[0] && replyEmbeds) {
                return message.reply({ embeds: [replyEmbeds.usageEmbed], allowedMentions: { repliedUser: false } })
            } else {

                let msg = [];
                let seenTypes = new Set();
                let buttonsNumber = 1;
                let curPage = 'System'
                const button1 = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("help_" + `config_${message.author.id}`)
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Config"),
                );
                const button2 = new ActionRowBuilder().addComponents();
                const button3 = new ActionRowBuilder().addComponents();
                let targetType = '';

                let hasSystem = helpCommands.some(command => command.type == "System");
                if (hasSystem) {
                    targetType = "System"
                } else {
                    let hasGeneral = helpCommands.some(command => command.type == "General");
                    if (hasGeneral) {
                        targetType = "General"
                    } else {
                        let hasAutoline = helpCommands.some(command => command.type == "Autoline");
                        if (hasAutoline) {
                            targetType = "Autoline"
                        } else {
                            let hasSuggestion = helpCommands.some(command => command.type == "Suggestion");
                            if (hasSuggestion) {
                                targetType = "Suggestion"
                            } else {
                                let hasTax = helpCommands.some(command => command.type == "Tax");
                                if (hasTax) {
                                    targetType = "Tax"
                                } else {
                                    let hasTicket = helpCommands.some(command => command.type == "Ticket");
                                    if (hasTicket) {
                                        targetType = "Ticket"
                                    } else {
                                        let hasGiveaway = helpCommands.some(command => command.type == "Giveaway");
                                        if (hasGiveaway) {
                                            targetType = "Giveaway"
                                        } else {
                                            let hasFeedback = helpCommands.some(command => command.type == "Feedback");
                                            if (hasFeedback) {
                                                targetType = "Feedback"
                                            } else {
                                                let hasApply = helpCommands.some(command => command.type == "Apply");
                                                if (hasApply) {
                                                    targetType = "Apply"
                                                } else {
                                                    let hasProtection = helpCommands.some(command => command.type == "Protection");
                                                    if (hasProtection) {
                                                        targetType = "Protection"
                                                    } else {
                                                        targetType = "Log"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                let inline = false
                const commandsOfType = helpCommands.filter(command => command.type === targetType);
                const numberOfCommands = commandsOfType.length;
                if(parseInt(numberOfCommands) >= 9) inline = true

                let botPrefix = prefixdb.get("Prefix_" + client.user.id) || '--'
                helpCommands.forEach((command) => {
                    let helpDec;
                    if(command.type == targetType){
                        let prefix;
                        let commandName;
                        if(command.prefix == true) prefix = botPrefix, commandName = command.prefix_commandName, helpDec = reply.Help[command.prefix_commandName]
                        else prefix = "/", commandName = command.slash_commandName, helpDec = reply.Help[command.slash_commandName]
                        if(helpDec){
                            msg.push({name: prefix + commandName, value: helpDec, inline: inline})
                        }
                    }
                    if (!seenTypes.has(command.type) && command.type != "Config") {
                        ++buttonsNumber;
                        seenTypes.add(command.type);
                        if (buttonsNumber <= 5) {
                            const newButton = new ButtonBuilder()
                                .setCustomId("help_" + command.type.toLowerCase() + `_${message.author.id}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel(command.type);
                            if (command.type == targetType) {
                                newButton.setDisabled(true);
                            }
                            button1.addComponents(newButton);
                        } else if(buttonsNumber <= 10) {
                            const newButton = new ButtonBuilder()
                                .setCustomId("help_" + command.type.toLowerCase() + `_${message.author.id}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setLabel(command.type);
                                if (command.type == targetType) {
                                    newButton.setDisabled(true);
                                }
                            button2.addComponents(newButton);
                        }else{
                            const newButton = new ButtonBuilder()
                            .setCustomId("help_" + command.type.toLowerCase() + `_${message.author.id}`)
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(command.type);
                            if (command.type == targetType) {
                                newButton.setDisabled(true);
                            }
                        button3.addComponents(newButton);
                        }
                    }
                });
                const embed = new EmbedBuilder()
                    .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) })
                    .setTimestamp()
                    .setColor(`DarkButNotBlack`)
                    .setTitle(targetType)
                    .setFooter({ text: `Requested By ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        ...msg
                    )
                if (buttonsNumber <= 5) {
                    message.reply({ embeds: [embed], components: [button1] });
                } else if(buttonsNumber <= 10){
                    message.reply({ embeds: [embed], components: [button1, button2] });
                }else{
                    message.reply({ embeds: [embed], components: [button1, button2, button3] });
                }

            }
        } catch (error) {
            console.log(error)
            return message.reply({ embeds: [replyEmbeds.notFoundEmbed], allowedMentions: { repliedUser: false } })
        }
    }
};