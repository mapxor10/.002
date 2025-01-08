const { Database } = require("st.db")
const tokendb = new Database("./Json-Database/Others/Tokens.json");
const rundb = new Database("./Json-Database/BotMaker/RunBots.json");
let tokens = tokendb.get("Bots") || []
const path = require('path');
const fs = require('fs');

let Node = 1
tokens.forEach(async (token) => {
	if (token.Node != Node) return
	const commandsdb = new Database(`/Json-Database/CommandsData/BotsCommands_${token.ClientID}.json`);
	const { Client, Collection, Discord, ButtonStyle, ButtonBuilder, ActionRowBuilder, createInvite, EmbedBuilder, ChannelType, ActivityType, WebhookClient, PermissionsBitField, GatewayIntentBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, Events, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ContextMenuCommandBuilder, SlashCommandBuilder, REST, Routes, GatewayCloseCodes } = require('discord.js');
	const { readdirSync } = require("fs");
	const client = new Client({
		intents: [
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.AutoModerationExecution,
			GatewayIntentBits.AutoModerationConfiguration,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.DirectMessageTyping,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildIntegrations,
			GatewayIntentBits.GuildInvites,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildMessageTyping,
			GatewayIntentBits.GuildModeration,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildScheduledEvents,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.GuildVoiceStates,
		],
		partials: [
			Partials.Channel,
			Partials.Message,
			Partials.User,
			Partials.GuildMember,
			Partials.Reaction,
			Partials.GuildScheduledEvent,
			Partials.ThreadMember,
		]
	});

	module.exports.client = client
	client.login(token.Token).catch((err) => console.log(require('chalk').red(`❌ Token are not working ${token.ClientID}`)));
	setInterval(async () => {
		if (client && client.user) {
			const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${client.user.id}.json`);
			let botGuilds = []
			client.guilds.cache.forEach(guild => {
				let channels = []
				let roles = []
				guild.channels.cache.forEach(channel => {
					if (channel.type != ChannelType.GuildText && channel.type != ChannelType.GuildAnnouncement && channel.type != ChannelType.GuildCategory) return
					else channels.push(
						{
							name: channel.name,
							id: channel.id,
							type: channel.type
						}
					)
				})
				guild.roles.cache.forEach(role => {
					if (role.name == "@everyone") return
					roles.push(
						{
							name: role.name,
							id: role.id
						}
					)
				})
				botGuilds.push(
					{
						name: guild.name,
						id: guild.id,
						avatar: guild.icon,
						owner: guild.ownerId,
						channels: channels,
						roles: roles
					}
				)
			})
			localData.set(`data_${client.user.id}`, {
				id: client?.user?.id,
				avatar: client?.user?.avatar,
				name: client?.user?.username,
				type: token.Type,
				node: token.Node,
				price: token.Price,
				servers: botGuilds
			})
		}
	}, 10000)
	client.on('err', (error) => {
		console.error('The bot encountered an error:', error);
	});

	process.on('unhandledRejection', (error) => {
		console.error('Unhandled promise rejection:', error);
	});

	process.on('uncaughtException', (err, origin) => {
		console.error(err)
	});
	process.on('uncaughtExceptionMonitor', (err, origin) => {
		console.error(err)

	});
	process.on('warning', (warning) => {
		return;
	});

	client.on('error', (error) => {
		console.error('An error occurred:', error);
	});

	client.on('shardError', (error) => {
		console.error('A shard error occurred:', error);
	});


	client.on("ready", async () => {
		const rest = new REST({ version: "10" }).setToken(token.Token);
		(async () => {
			try {
				await rest.put(Routes.applicationCommands(token.ClientID), {
					body: slashcommands,
				});
			} catch (error) {
				console.error(error);
			}
		})();
	});

	client.slashcommands = new Collection();
	const slashcommands = [];
	let botCommands = commandsdb.get('commands_' + token.ClientID) || []
	if (botCommands.length) {
		for (let folder of fs.readdirSync(path.join(__dirname, 'slash-commands')).filter((folder) => !folder.includes("."))) {
			for (let file of fs.readdirSync(path.join(__dirname, 'slash-commands', folder)).filter((f) => f.endsWith(".js"))) {
				let command = require(path.join(__dirname, 'slash-commands', folder, file));
				if (command) {
					botCommands.forEach(com => {
						if (com.type == command.type && com.slash_commandName == command.data.name) {
							slashcommands.push(command.data);
							client.slashcommands.set(command.data.name, command);
						}
					})
				}
			}
		}
	}


	// Join Leave Function
	var { inviteTracker } = require("discord-inviter"),
		tracker = new inviteTracker(client)
	const messages = new Database("./Bot/messages.json");
	const Botlanguage = new Database("/Json-Database/Others/Language.json");
	const logdb = new Database("./Bot/Json-Database/Systems/Log.json");
	const protectiondb = new Database("./Bot/Json-Database/Settings/Protection.json")
	tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {
		const commandsdb = new Database(`/Json-Database/CommandsData/BotsCommands_${client.user.id}.json`);
		const language = await Botlanguage.get(client.user.id) || "EN"
		const reply = await messages.get(language)
		let inviterUser;
		let log1 = logdb.get("member-joined_" + member?.guild?.id + "_" + client.user.id) || null

		if (member?.user?.id == inviter?.id) inviterUser = null
		inviterUser = inviter
		if (log1) {
			let channel = await member?.guild?.channels.cache.get(log1.channel) || await member?.guild?.channels.fetch(log1.channel).catch()
			if (!channel) return
			let embed = new EmbedBuilder()
				.setColor(log1.color || "Green")
				.setThumbnail(member.user.avatarURL({ dynamic: true }))
				.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
				.setFooter({ iconURL: member?.guild?.iconURL({ dynamic: true }), text: member?.guild?.name })
				.setTimestamp()
				.setDescription(reply.Log.Reply14.replace("[USER]", member.user))
				.addFields(
					{ name: reply.Log.Field3.name, value: reply.Log.Field3.value.replace("[DATE]", "<t:" + Math.floor(member.user.createdAt.getTime() / 1000) + ":R>"), inline: true }
				)
			if (inviterUser) {
				embed.addFields(
					{ name: reply.Log.Field4.name, value: reply.Log.Field4.value.replace("[INVITER]", inviterUser), inline: true }
				)
			}
			channel.send({ embeds: [embed] })
		}

		let botCommands = commandsdb.get('commands_' + client.user.id) || []
		const hasProtection = botCommands.some(command => command.type == "Protection");
		if (hasProtection) {
			if (member.user.bot) {
				if (inviter.id == client.user.id || inviter.id == member?.guild?.ownerId) {

				} else {
					let status = protectiondb.get("antiBots_" + member.guild.id + "_" + client.user.id) || "on"
					if (status == "on") {
						member.kick().catch(err => { })
					}
					let limit = protectiondb.get("actionLimit_" + "add_bots_" + member?.guild?.id + "_" + client.user.id) || 3
					let automode = protectiondb.get("autoMode_" + "add_bots_" + member?.guild?.id + "_" + client.user.id) || "delete_roles"
					let whitelistCheck = protectiondb.get("whiteList_" + member?.guild?.id + "_" + member.id + "_" + client.user.id) || []
					let logID = protectiondb.get("protectionLog_" + member?.guild?.id + "_" + client.user.id) || null
					if (whitelistCheck && (whitelistCheck.includes("add_bots") || whitelistCheck.includes("all"))) {
						if (logID) {
							let log = member?.guild?.channels.cache.get(logID)
							if (log) {
								let embed = new EmbedBuilder()
									.setColor("Red")
									.setThumbnail(member.user.avatarURL({ dynamic: true }))
									.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
									.setFooter({ iconURL: inviter.avatarURL({ dynamic: true }), text: inviter.username })
									.setTimestamp()
									.setDescription(reply.Protection.Reply13.replace("[BOT]", member.user).replace("[AUTHOR]", inviterUser).replace("[TIMES]", reply.Protection.Whitelist.yes))
								log.send({ embeds: [embed] })
							}
						}
					} else {
						let userData = protectiondb.get("protectionData_" + "add_bots_" + member?.guild?.id + "_" + inviter.id + "_" + client.user.id) || 0
						let timeLeft = limit - userData

						if (logID) {
							let log = member?.guild?.channels.cache.get(logID)
							if (log) {
								let embed = new EmbedBuilder()
									.setColor("Red")
									.setThumbnail(member.user.avatarURL({ dynamic: true }))
									.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
									.setFooter({ iconURL: inviter.avatarURL({ dynamic: true }), text: inviter.username })
									.setTimestamp()
									.setDescription(reply.Protection.Reply10.replace("[USER]", member.user).replace("[AUTHOR]", inviter).replace("[ACTION]", "added").replace("[TIMES]", timeLeft))
								log.send({ embeds: [embed] })
							}
						}
						protectiondb.set("protectionData_" + "add_bots_" + member?.guild?.id + "_" + inviter.id + "_" + client.user.id, userData + 1)
						if (userData >= limit) {
							let done = false
							if (automode === 'delete_roles') {
								const user = member?.guild?.members.cache.get(inviter.id)
								if (user) {
									user.roles.cache.forEach(async r => {
										await user.roles.remove(r).then(() => {
											done = true
										}).catch(err => { })
									})
								}
							} else if (automode == 'kick') {
								const user = member?.guild?.members.cache.get(inviter.id)
								user.kick().then(() => {
									done = true
								}).catch(err => { })
							}
							else if (automode == 'ban') {
								const user = member?.guild?.members.cache.get(inviter.id)
								user.ban().then(() => {
									done = true
								}).catch(err => { })
							}
							let serverOwner = member?.guild?.members.cache.get(member?.guild?.ownerId)
							setTimeout(() => {
								if (serverOwner && done == true) {
									let embed = new EmbedBuilder()
										.setColor("Green")
										.setFooter({ text: reply.Others.Powered })
										.setTimestamp()
										.setDescription(reply.Protection.OwnerMSG.Desc.replace("[OWNER]", serverOwner))
										.addFields(
											{ name: reply.Protection.OwnerMSG.Fileds.Field1.name, value: reply.Protection.OwnerMSG.Fileds.Field1.value.replace("[GUILDNAME]", member?.guild?.name) },
											{ name: reply.Protection.OwnerMSG.Fileds.Field2.name, value: reply.Protection.OwnerMSG.Fileds.Field2.value.replace("[USER_MENTION]", inviter) },
											{ name: reply.Protection.OwnerMSG.Fileds.Field3.name, value: reply.Protection.OwnerMSG.Fileds.Field3.value.replace("[USER_ID]", inviter.id) },
											{ name: reply.Protection.OwnerMSG.Fileds.Field4.name, value: reply.Protection.OwnerMSG.Fileds.Field4.value.replace("[ACTION]", "Adding bots") },
										)
									serverOwner.send({ embeds: [embed] })
								}
							}, 1000)
						}
					}
				}
			}
		}
	})


	client.commands = new Collection();
	require("./handlers/commands")(client);

	client.button = new Collection();
	require("./handlers/button")(client);

	client.selectmenu = new Collection();
	require("./handlers/selectmenu")(client);

	client.modal = new Collection();
	require("./handlers/modal")(client);

	client.events = new Collection();
	require("./handlers/events")(client);


})

setInterval(() => {
	try {
		const botIDArray = rundb.get('RunBot');//
		let tokens = tokendb.get("Bots") || []
		if (Array.isArray(botIDArray) && botIDArray.length > 0) {
			const botID = botIDArray.shift();
			if (botIDArray) {
				if (tokens) {
					const token = tokens.find(da => da.ClientID === botID);//
					if (token.Node != Node) return

					const commandsdb = new Database(`/Json-Database/CommandsData/BotsCommands_${botID}.json`);
					const { Client, Collection, Discord, ButtonStyle, ButtonBuilder, ActionRowBuilder, createInvite, EmbedBuilder, ChannelType, ActivityType, WebhookClient, PermissionsBitField, GatewayIntentBits, Partials, ApplicationCommandType, ApplicationCommandOptionType, Events, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ContextMenuCommandBuilder, SlashCommandBuilder, REST, Routes, GatewayCloseCodes } = require('discord.js');
					const { readdirSync } = require("fs");
					const client = new Client({
						intents: [
							GatewayIntentBits.DirectMessages,
							GatewayIntentBits.Guilds,
							GatewayIntentBits.GuildMessages,
							GatewayIntentBits.MessageContent,
							GatewayIntentBits.GuildMembers,
							GatewayIntentBits.AutoModerationExecution,
							GatewayIntentBits.AutoModerationConfiguration,
							GatewayIntentBits.DirectMessageReactions,
							GatewayIntentBits.DirectMessageTyping,
							GatewayIntentBits.GuildEmojisAndStickers,
							GatewayIntentBits.GuildIntegrations,
							GatewayIntentBits.GuildInvites,
							GatewayIntentBits.GuildMessageReactions,
							GatewayIntentBits.GuildMessageTyping,
							GatewayIntentBits.GuildModeration,
							GatewayIntentBits.GuildPresences,
							GatewayIntentBits.GuildScheduledEvents,
							GatewayIntentBits.GuildWebhooks,
							GatewayIntentBits.GuildVoiceStates,
						],
						partials: [
							Partials.Channel,
							Partials.Message,
							Partials.User,
							Partials.GuildMember,
							Partials.Reaction,
							Partials.GuildScheduledEvent,
							Partials.ThreadMember,
						]
					});

					module.exports.client = client
					setInterval(async () => {
						if (client && client.user) {
							const localData = new Database(`/Json-Database/BotsLocalData/LocalData_${client.user.id}.json`);
							let botGuilds = []
							client.guilds.cache.forEach(guild => {
								let channels = []
								let roles = []
								guild.channels.cache.forEach(channel => {
									if (channel.type != ChannelType.GuildText && channel.type != ChannelType.GuildAnnouncement && channel.type != ChannelType.GuildCategory) return
									else channels.push(
										{
											name: channel.name,
											id: channel.id,
											type: channel.type
										}
									)
								})
								guild.roles.cache.forEach(role => {
									if (role.name == "@everyone") return
									roles.push(
										{
											name: role.name,
											id: role.id
										}
									)
								})
								botGuilds.push(
									{
										name: guild.name,
										id: guild.id,
										avatar: guild.icon,
										owner: guild.ownerId,
										channels: channels,
										roles: roles
									}
								)
							})
							localData.set(`data_${client.user.id}`, {
								id: client?.user?.id,
								avatar: client?.user?.avatar,
								name: client?.user?.username,
								type: token.Type,
								node: token.Node,
								price: token.Price,
								servers: botGuilds,
							})
						}
					}, 10000)
					client.on('err', (error) => {
						console.error('The bot encountered an error:', error);
					});

					process.on('unhandledRejection', (error) => {
						console.error('Unhandled promise rejection:', error);
					});

					process.on('uncaughtException', (err, origin) => {
						console.error(err)
					});
					process.on('uncaughtExceptionMonitor', (err, origin) => {
						console.error(err)

					});
					process.on('warning', (warning) => {
						return;
					});

					client.on('error', (error) => {
						console.error('An error occurred:', error);
					});

					client.on('shardError', (error) => {
						console.error('A shard error occurred:', error);
					});

					client.on("ready", async () => {
						const rest = new REST({ version: "10" }).setToken(token.Token);
						(async () => {
							try {
								await rest.put(Routes.applicationCommands(token.ClientID), {
									body: slashcommands,
								});
							} catch (error) {
								console.error(error);
							}
						})();
					});

					client.slashcommands = new Collection();
					const slashcommands = [];
					let botCommands = commandsdb.get('commands_' + token.ClientID) || []
					if (botCommands.length) {
						for (let folder of fs.readdirSync(path.join(__dirname, 'slash-commands')).filter((folder) => !folder.includes("."))) {
							for (let file of fs.readdirSync(path.join(__dirname, 'slash-commands', folder)).filter((f) => f.endsWith(".js"))) {
								let command = require(path.join(__dirname, 'slash-commands', folder, file));
								if (command) {
									botCommands.forEach(com => {
										if (com.type == command.type && com.slash_commandName == command.data.name) {
											slashcommands.push(command.data);
											client.slashcommands.set(command.data.name, command);
										}
									})
								}
							}
						}
					}


					// Join Leave Function
					var { inviteTracker } = require("discord-inviter"),
						tracker = new inviteTracker(client)
					const messages = new Database("./Bot/messages.json");
					const Botlanguage = new Database("/Json-Database/Others/Language.json");
					const logdb = new Database("./Bot/Json-Database/Systems/Log.json");
					const protectiondb = new Database("./Bot/Json-Database/Settings/Protection.json")
					tracker.on("guildMemberAdd", async (member, inviter, invite, error) => {
						const commandsdb = new Database(`/Json-Database/CommandsData/BotsCommands_${client.user.id}.json`);
						const language = await Botlanguage.get(client.user.id) || "EN"
						const reply = await messages.get(language)
						let inviterUser;
						let log1 = logdb.get("member-joined_" + member?.guild?.id + "_" + client.user.id) || null

						if (member?.user?.id == inviter?.id) inviterUser = null
						inviterUser = inviter
						if (log1) {
							let channel = await member?.guild?.channels.cache.get(log1.channel) || await member?.guild?.channels.fetch(log1.channel).catch()
							if (!channel) return
							let embed = new EmbedBuilder()
								.setColor(log1.color || "Green")
								.setThumbnail(member.user.avatarURL({ dynamic: true }))
								.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
								.setFooter({ iconURL: member?.guild?.iconURL({ dynamic: true }), text: member?.guild?.name })
								.setTimestamp()
								.setDescription(reply.Log.Reply14.replace("[USER]", member.user))
								.addFields(
									{ name: reply.Log.Field3.name, value: reply.Log.Field3.value.replace("[DATE]", "<t:" + Math.floor(member.user.createdAt.getTime() / 1000) + ":R>"), inline: true }
								)
							if (inviterUser) {
								embed.addFields(
									{ name: reply.Log.Field4.name, value: reply.Log.Field4.value.replace("[INVITER]", inviterUser), inline: true }
								)
							}
							channel.send({ embeds: [embed] })
						}

						let botCommands = commandsdb.get('commands_' + client.user.id) || []
						const hasProtection = botCommands.some(command => command.type == "Protection");
						if (hasProtection) {
							if (member.user.bot) {
								if (inviter.id == client.user.id || inviter.id == member?.guild?.ownerId) {

								} else {
									let status = protectiondb.get("antiBots_" + member.guild.id + "_" + client.user.id) || "on"
									if (status == "on") {
										member.kick().catch(err => { })
									}
									let limit = protectiondb.get("actionLimit_" + "add_bots_" + member?.guild?.id + "_" + client.user.id) || 3
									let automode = protectiondb.get("autoMode_" + "add_bots_" + member?.guild?.id + "_" + client.user.id) || "delete_roles"
									let whitelistCheck = protectiondb.get("whiteList_" + member?.guild?.id + "_" + member.id + "_" + client.user.id) || []
									let logID = protectiondb.get("protectionLog_" + member?.guild?.id + "_" + client.user.id) || null
									if (whitelistCheck && (whitelistCheck.includes("add_bots") || whitelistCheck.includes("all"))) {
										if (logID) {
											let log = member?.guild?.channels.cache.get(logID)
											if (log) {
												let embed = new EmbedBuilder()
													.setColor("Red")
													.setThumbnail(member.user.avatarURL({ dynamic: true }))
													.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
													.setFooter({ iconURL: inviter.avatarURL({ dynamic: true }), text: inviter.username })
													.setTimestamp()
													.setDescription(reply.Protection.Reply13.replace("[BOT]", member.user).replace("[AUTHOR]", inviterUser).replace("[TIMES]", reply.Protection.Whitelist.yes))
												log.send({ embeds: [embed] })
											}
										}
									} else {
										let userData = protectiondb.get("protectionData_" + "add_bots_" + member?.guild?.id + "_" + inviter.id + "_" + client.user.id) || 0
										let timeLeft = limit - userData

										if (logID) {
											let log = member?.guild?.channels.cache.get(logID)
											if (log) {
												let embed = new EmbedBuilder()
													.setColor("Red")
													.setThumbnail(member.user.avatarURL({ dynamic: true }))
													.setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ dynamic: true }) })
													.setFooter({ iconURL: inviter.avatarURL({ dynamic: true }), text: inviter.username })
													.setTimestamp()
													.setDescription(reply.Protection.Reply10.replace("[USER]", member.user).replace("[AUTHOR]", inviter).replace("[ACTION]", "added").replace("[TIMES]", timeLeft))
												log.send({ embeds: [embed] })
											}
										}
										protectiondb.set("protectionData_" + "add_bots_" + member?.guild?.id + "_" + inviter.id + "_" + client.user.id, userData + 1)
										if (userData >= limit) {
											let done = false
											if (automode === 'delete_roles') {
												const user = member?.guild?.members.cache.get(inviter.id)
												if (user) {
													user.roles.cache.forEach(async r => {
														await user.roles.remove(r).then(() => {
															done = true
														}).catch(err => { })
													})
												}
											} else if (automode == 'kick') {
												const user = member?.guild?.members.cache.get(inviter.id)
												user.kick().then(() => {
													done = true
												}).catch(err => { })
											}
											else if (automode == 'ban') {
												const user = member?.guild?.members.cache.get(inviter.id)
												user.ban().then(() => {
													done = true
												}).catch(err => { })
											}
											let serverOwner = member?.guild?.members.cache.get(member?.guild?.ownerId)
											setTimeout(() => {
												if (serverOwner && done == true) {
													let embed = new EmbedBuilder()
														.setColor("Green")
														.setFooter({ text: reply.Others.Powered })
														.setTimestamp()
														.setDescription(reply.Protection.OwnerMSG.Desc.replace("[OWNER]", serverOwner))
														.addFields(
															{ name: reply.Protection.OwnerMSG.Fileds.Field1.name, value: reply.Protection.OwnerMSG.Fileds.Field1.value.replace("[GUILDNAME]", member?.guild?.name) },
															{ name: reply.Protection.OwnerMSG.Fileds.Field2.name, value: reply.Protection.OwnerMSG.Fileds.Field2.value.replace("[USER_MENTION]", inviter) },
															{ name: reply.Protection.OwnerMSG.Fileds.Field3.name, value: reply.Protection.OwnerMSG.Fileds.Field3.value.replace("[USER_ID]", inviter.id) },
															{ name: reply.Protection.OwnerMSG.Fileds.Field4.name, value: reply.Protection.OwnerMSG.Fileds.Field4.value.replace("[ACTION]", "Adding bots") },
														)
													serverOwner.send({ embeds: [embed] })
												}
											}, 1000)
										}
									}
								}
							}
						}
					})

					client.commands = new Collection();
					require("./handlers/commands")(client);

					client.button = new Collection();
					require("./handlers/button")(client);

					client.selectmenu = new Collection();
					require("./handlers/selectmenu")(client);

					client.modal = new Collection();
					require("./handlers/modal")(client);

					client.events = new Collection();
					require("./handlers/events")(client);



					rundb.pull('RunBot', botID).then(() => {
						client.login(token.Token).then(() => {
						}).catch((err) => {
							console.log(err)
							console.log(`token ${token.PurchasesID} not working`)
						});
					})


				}
			}
		}
	} catch (error) {
		console.log(error)
	}
}, 5000);
