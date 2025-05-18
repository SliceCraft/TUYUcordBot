import {ActionRowBuilder as MessageActionRow, ButtonBuilder as MessageButton, EmbedBuilder} from "discord.js";

export default {
    "name": "adminticket",
    "category": "general",
    "description": "Post ticket embed, admin only",
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});

        const ticketEmbed = new EmbedBuilder();
        ticketEmbed.setColor(0x00FFFF);
        ticketEmbed.setTitle("Create a ticket!");
        ticketEmbed.setDescription("Choose one of the topics below and a ticket will be made for you so you can discuss with staff")
        const components = [];
        components.push(new MessageButton()
            .setCustomId(`ticket-start-moderation`)
            .setLabel("Moderation")
            .setStyle(1)
        );
        components.push(new MessageButton()
            .setCustomId(`ticket-start-appeal`)
            .setLabel("Appeal (NOT IMPLEMENTED)")
            .setStyle(1)
        );
        components.push(new MessageButton()
            .setCustomId(`ticket-start-affiliate`)
            .setLabel("Become an affiliate")
            .setStyle(1)
        );
        components.push(new MessageButton()
            .setCustomId(`ticket-start-general`)
            .setLabel("Other/general")
            .setStyle(1)
        );


        const componentrows = [];
        const row = new MessageActionRow().addComponents(components);
        componentrows.push(row);
        await interaction.channel.send({ embeds: [
                ticketEmbed
            ],
            components: componentrows});

        await interaction.editReply({content: 'Posted'});
    }
}
