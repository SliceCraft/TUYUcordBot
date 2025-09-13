import 'dotenv/config';
import * as discord from "discord.js";
import {Partials, REST, Routes, SlashCommandBuilder} from "discord.js";
import * as fs from "fs";
import StrikeChannelAnnouncementManager from "./libraries/strikes/StrikeChannelAnnouncementManager.js";
import BanChecker from "./libraries/strikes/BanChecker.js";

// TODO: Schedule a check that cleans up the tickets folder
// TODO: Stop having this globally available
global.client = new discord.Client({
    intents: [
        discord.GatewayIntentBits.Guilds,
        discord.GatewayIntentBits.GuildMessages,
        discord.GatewayIntentBits.GuildMembers,
        discord.GatewayIntentBits.GuildModeration,
        discord.GatewayIntentBits.GuildMessageReactions,
        discord.GatewayIntentBits.DirectMessages,
        discord.GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Reaction,
        Partials.Message
    ]
});

// TODO: Rn this has to be done async because the import needs to be finished before the function can be run
// This can cause the situation where it'll try to deploy the slash commands while loading the modules hasn't finished yet
fs.readdirSync("./modules/").forEach(async folder => {
    let moduleFile = await import(`./modules/${folder}/load.js`);
    moduleFile.run();
});

client.on("clientReady", async () => {
    client.user.setPresence({ activities: [{ name: "Listening to banger TUYU songs", type: discord.ActivityType.Custom }], status: 'online'});
    setInterval(async () => {
        await client.user.setPresence({ activities: [{ name: "Listening to banger TUYU songs", type: discord.ActivityType.Custom }], status: 'online'});

        await StrikeChannelAnnouncementManager.cleanUp()
    }, 600e3);

    // Using a timeout to prevent potential problems when the modules haven't been fully oladed yet
    setTimeout(() => {
        // TODO: This deployment code is horrible, it does work though
        const deployGuilds = [
            process.env.DEPLOY_GUILD
        ];

        function setStandardOptions(baseoption, optiondata){
            baseoption.setName(optiondata.name);
            baseoption.setDescription(optiondata.description);
            baseoption.setRequired(optiondata.required ?? false);
            // baseoption.addChannelTypes(optiondata.channel_types);
            return baseoption;
        }

        const slashcollection = [];
        client.commands.forEach(command => {
            const slashcommand = new SlashCommandBuilder()
                .setName(command.name)
                .setDescription(command.description);
            if(command.options) command.options.forEach(option => {
                if(option.type == "USER"){
                    slashcommand.addUserOption(useroption => {
                        return setStandardOptions(useroption, option);
                    });
                }else if(option.type == "STRING"){
                    slashcommand.addStringOption(stringoption => {
                        if(option.autocomplete) {
                            stringoption.setAutocomplete(option.autocomplete);
                        }
                        if(option.choices){
                            stringoption.addChoices(...option.choices)
                        }
                        return setStandardOptions(stringoption, option);
                    });
                }else if(option.type == "CHANNEL"){
                    slashcommand.addChannelOption(channeloption => {
                        if(option.channel_types) option.channel_types.forEach(type => {
                            if(type == "GUILD_TEXT") channeloption.addChannelTypes(0);
                            else if(type == "GUILD_VOICE") channeloption.addChannelTypes(2);
                            else if(type == "GUILD_CATEGORY") channeloption.addChannelTypes(4);
                            else if(type == "GUILD_NEWS") channeloption.addChannelTypes(5);
                            else if(type == "GUILD_NEWS_THREAD") channeloption.addChannelTypes(10);
                            else if(type == "GUILD_PUBLIC_THREAD") channeloption.addChannelTypes(11);
                            else if(type == "GUILD_PRIVATE_THREAD") channeloption.addChannelTypes(12);
                            else if(type == "GUILD_STAGE_VOICE") channeloption.addChannelTypes(13);
                        });
                        return setStandardOptions(channeloption, option);
                    });
                }else if(option.type == "INTEGER"){
                    slashcommand.addIntegerOption(integeroption => {
                        return setStandardOptions(integeroption, option);
                    });
                }else if(option.type == "USER"){
                    slashcommand.addUserOption(useroption => {
                        return setStandardOptions(useroption, option);
                    });
                }else if(option.type == "ROLE"){
                    slashcommand.addRoleOption(roleoption => {
                        return setStandardOptions(roleoption, option);
                    });
                }else if(option.type == "SUB_COMMAND"){
                    return slashcommand.addSubcommand(subcommand => {
                        subcommand.setName(option.name);
                        subcommand.setDescription(option.description);
                        if(option.options) option.options.forEach(option => {
                            if(option.type == "USER"){
                                subcommand.addUserOption(useroption => {
                                    return setStandardOptions(useroption, option);
                                });
                            }else if(option.type == "STRING"){
                                subcommand.addStringOption(stringoption => {
                                    if(option.autocomplete) {
                                        stringoption.setAutocomplete(option.autocomplete);
                                    }
                                    if(option.choices){
                                        stringoption.addChoices(...option.choices)
                                    }
                                    return setStandardOptions(stringoption, option);
                                });
                            }else if(option.type == "CHANNEL"){
                                subcommand.addChannelOption(channeloption => {
                                    if(option.channel_types) option.channel_types.forEach(type => {
                                        if(type == "GUILD_TEXT") channeloption.addChannelTypes(0);
                                        else if(type == "GUILD_VOICE") channeloption.addChannelTypes(2);
                                        else if(type == "GUILD_CATEGORY") channeloption.addChannelTypes(4);
                                        else if(type == "GUILD_NEWS") channeloption.addChannelTypes(5);
                                        else if(type == "GUILD_PUBLIC_THREAD") channeloption.addChannelTypes(11);
                                        else if(type == "GUILD_PRIVATE_THREAD") channeloption.addChannelTypes(12);
                                        else if(type == "GUILD_STAGE_VOICE") channeloption.addChannelTypes(13);
                                    });
                                    return setStandardOptions(channeloption, option);
                                });
                            }else if(option.type == "INTEGER"){
                                subcommand.addIntegerOption(integeroption => {
                                    return setStandardOptions(integeroption, option);
                                });
                            }else if(option.type == "USER"){
                                subcommand.addUserOption(useroption => {
                                    return setStandardOptions(useroption, option);
                                });
                            }else if(option.type == "ROLE"){
                                subcommand.addRoleOption(roleoption => {
                                    return setStandardOptions(roleoption, option);
                                });
                            }
                        });
                        return subcommand;
                    });
                }else if(option.type == "SUB_COMMAND_GROUP"){
                    return slashcommand.addSubcommandGroup(subcommandgroup => {
                        subcommandgroup.setName(option.name);
                        subcommandgroup.setDescription(option.description);
                        option.options.forEach(option => {
                            return subcommandgroup.addSubcommand(subcommand => {
                                subcommand.setName(option.name);
                                subcommand.setDescription(option.description);
                                option.options.forEach(option => {
                                    if(option.type == "USER"){
                                        subcommand.addUserOption(useroption => {
                                            return setStandardOptions(useroption, option);
                                        });
                                    }else if(option.type == "STRING"){
                                        subcommand.addStringOption(stringoption => {
                                            if(option.autocomplete) {
                                                stringoption.setAutocomplete(option.autocomplete);
                                            }
                                            if(option.choices){
                                                stringoption.addChoices(...option.choices)
                                            }
                                            return setStandardOptions(stringoption, option);
                                        });
                                    }else if(option.type == "CHANNEL"){
                                        subcommand.addChannelOption(channeloption => {
                                            return setStandardOptions(channeloption, option);
                                        });
                                    }else if(option.type == "INTEGER"){
                                        subcommand.addIntegerOption(integeroption => {
                                            return setStandardOptions(integeroption, option);
                                        });
                                    }else if(option.type == "USER"){
                                        subcommand.addUserOption(useroption => {
                                            return setStandardOptions(useroption, option);
                                        });
                                    }else if(option.type == "ROLE"){
                                        subcommand.addRoleOption(roleoption => {
                                            return setStandardOptions(roleoption, option);
                                        });
                                    }
                                });
                                return subcommand;
                            });
                        });
                        return subcommandgroup;
                    });
                }
            });
            slashcollection.push(slashcommand);
        });
        const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
        console.log("Started refreshing slash commands");
        deployGuilds.forEach(async guild => {
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, guild),
                { body: slashcollection },
            );
        });
        console.log("Finished refreshing slash commands");
    }, 5e3);

    await BanChecker.onStartup();
});

client.login(process.env.DISCORD_TOKEN);
