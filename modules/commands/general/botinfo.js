import { EmbedBuilder } from "discord.js";

export default {
    "name": "botinfo",
    "category": "general",
    "description": "Information about the bot",
    async execute(interaction){
        let days = 0;
        let totalSeconds = (client.uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        if(hours > 23){
            days = hours / 24;
            days = Math.floor(days);
            hours = hours - (days * 24);
        }

        if(minutes > 60){
            minutes = 0;
        }

        let uptime = `The bot has been online for ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

        let BotinfoEmbed = new EmbedBuilder();
        BotinfoEmbed.setTitle("Bot info");
        BotinfoEmbed.setColor(0x00FFFF);
        BotinfoEmbed.addFields(
            { name: `Uptime:`, value: `${uptime}`},
        );
        interaction.reply({ embeds: [
            BotinfoEmbed
        ]});
    }
}
