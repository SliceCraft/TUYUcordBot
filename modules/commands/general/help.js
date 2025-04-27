import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

export default {
    "name": "help",
    "category": "general",
    "description": "List all commands",
    async execute(interaction){
        let description = [
            `:speech_balloon: General`,
            `:exclamation: All commands`
        ];
        let help = new EmbedBuilder();
        help.setColor(0x00FFFF);
        help.setTitle("Help categories");
        help.setDescription(description.join("\n"));
        let row = new ActionRowBuilder().addComponents([
            new StringSelectMenuBuilder()
				.setCustomId('help-select')
				.setPlaceholder('Nothing')
				.addOptions([
				    {
    					label: "General",
					    value: 'general_help',
				    },
                    {
    					label: "All commands",
					    value: 'all_commands_help',
				    }
			    ]),
        ]);
        interaction.reply({ embeds: [
            help
        ],
        components: [
            row
        ], ephemeral: true });
    },
    async select(interaction, config){
        if(interaction.customId == "help-select"){
            let help = new EmbedBuilder();
            help.setColor(0x00FFFF);
            let selection = interaction.values[0].slice(0,-5);
            help.setTitle("Help category: " + selection);
            if(selection != "all_commands") {
                client.commands.forEach(command => {
                    if(selection == command.category){
                        help.addFields({name: `/${command.name}`, value: `${command.description}`});
                    }
                });
            }else{
                let commands = [];
                client.commands.forEach(command => {
                    commands.push(`**/${command.name}** (${command.description})`)
                });
                help.setDescription(commands.join("\n"));
            }
            interaction.update({ embeds: [
                help
            ]});
        }
    }
};