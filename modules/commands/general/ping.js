import { EmbedBuilder } from "discord.js";

export default {
    "name": "ping",
    "category": "general",
    "description": "Check the ping with Discord",
    async execute(interaction){
        await interaction.deferReply({ ephemeral: true });
        let PingEmbed = new EmbedBuilder();
        PingEmbed.setTitle("Pong!");
        PingEmbed.setColor(0x00EEFF);
        PingEmbed.setDescription(`Ping: ${client.ws.ping ? `${Math.round(client.ws.ping)}` : ''}ms.`);
        interaction.editReply({ embeds: [
            PingEmbed
        ]});
    }
};