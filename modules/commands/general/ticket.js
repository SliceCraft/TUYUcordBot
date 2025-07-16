import TicketManager from "../../../libraries/tickets/TicketManager.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";
import {
    ActionRowBuilder as MessageActionRow,
    ButtonBuilder as MessageButton,
    EmbedBuilder,
    PermissionsBitField
} from "discord.js";

var ticketManager = new TicketManager();

export default {
    "name": "ticket",
    "category": "general",
    "description": "Use the ticket system",
    "options": [
        {
            name: 'new',
            description: 'Open a new ticket',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'type',
                    description: 'The type of ticket you want to open',
                    type: 'STRING',
                    choices: [
                        {
                            name: "Moderation", value: "moderation"
                        },{
                            name: "Become an affiliate", value: "affiliate"
                        },{
                            name: 'Appeal', value: 'appeal'
                        },{
                            name: "Other/general", value: "general"
                        }
                    ],
                    required: true
                },
                {
                    name: "user",
                    description: "The user you want to open a ticket for",
                    type: "USER",
                    required: false
                }
            ]
        },
        {
            name: 'close',
            description: 'Close the ticket',
            type: 'SUB_COMMAND',
            options: []
        },
        {
            name: 'adduser',
            description: 'Add a user to the ticket',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user you want to add',
                    type: 'USER',
                    required: true
                }
            ]
        },
        {
            name: 'removeuser',
            description: 'Remove a user from the ticket',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'The user you want to remove',
                    type: 'USER',
                    required: true
                }
            ]
        }
    ],
    async execute(interaction){
        if(interaction.options.getSubcommand() === 'new'){
            await this.new(interaction);
        }else if(interaction.options.getSubcommand() === 'close'){
            await this.close(interaction);
        }else if(interaction.options.getSubcommand() === 'adduser'){
            await this.addUser(interaction);
        }else if(interaction.options.getSubcommand() === 'removeuser'){
            await this.removeUser(interaction);
        }
    },
    async new(interaction){
        await interaction.deferReply({ephemeral: true});

        const user = (
            interaction.options.getUser("user") &&
            RoleChecker.isTrialOrAbove(interaction.member)
        ) ? interaction.options.getUser("user") :
            interaction.member.user;
        const type = interaction.options.getString('type');

        const ticket = await ticketManager.createTicket(user, type, interaction.guild);
        await interaction.editReply({content: `A ticket has been opened! <#${ticket.channelid}>`});
    },
    async close(interaction){
        await interaction.deferReply({ephemeral: true});

        const ticket = ticketManager.getTicket(interaction.channel.id);

        if(!ticket){
            await interaction.editReply({content: `This is not a ticket`});
            return;
        }

        if(ticket.userid !== interaction.user.id && !RoleChecker.isTrialOrAbove(interaction.member)){
            await interaction.editReply({content: `You are not allowed to close this ticket`});
            return;
        }

        await ticket.close(interaction.user, interaction.guild);
    },
    async addUser(interaction){
        await interaction.deferReply({ephemeral: true});

        const ticket = ticketManager.getTicket(interaction.channel.id);

        if(!ticket){
            await interaction.editReply({content: `This is not a ticket`});
            return;
        }

        if(ticket.userid !== interaction.user.id && !RoleChecker.isTrialOrAbove(interaction.member)){
            await interaction.editReply({content: `You are not allowed to add users to this ticket`});
            return;
        }

        const user = interaction.options.getUser('user');
        await interaction.guild.channels.cache.get(ticket.channelid).permissionOverwrites.edit(user.id, {
            'ViewChannel': true,
            'SendMessages': true
        });

        await interaction.editReply({content: `<@${user.id}> was added to the ticket`});
    },
    async removeUser(interaction){
        await interaction.deferReply({ephemeral: true});

        const ticket = ticketManager.getTicket(interaction.channel.id);

        if(!ticket){
            await interaction.editReply({content: `This is not a ticket`});
            return;
        }

        if(ticket.userid !== interaction.user.id && !RoleChecker.isTrialOrAbove(interaction.member)){
            await interaction.editReply({content: `You are not allowed to remove users from this ticket`});
            return;
        }

        const user = interaction.options.getUser('user');
        await interaction.guild.channels.cache.get(ticket.channelid).permissionOverwrites.delete(user.id);

        await interaction.editReply({content: `<@${user.id}> was removed from the ticket`});
    },

    async button(interaction){
        await interaction.deferReply({ephemeral: true});

        const interactionType = interaction.customId.split('-')[1];

        if (interactionType === 'start'){
            return await this.startTicket(interaction);
        }else if (interactionType === 'create'){
            return await this.createTicket(interaction);
        }else if(interactionType === 'deny'){
            return await this.deny(interaction);
        }
    },
    async startTicket(interaction){
        const ticketType = interaction.customId.split('-')[2];

        const ticketEmbed = new EmbedBuilder();
        ticketEmbed.setColor(0x00FFFF);
        ticketEmbed.setTitle("Are you sure!");
        ticketEmbed.setDescription(`Are you sure you cant to create a ${ticketType} ticket?`);

        const components = [];
        components.push(new MessageButton()
            .setCustomId(`ticket-create-${ticketType}`)
            .setLabel("Yes")
            .setStyle(3)
        );
        components.push(new MessageButton()
            .setCustomId(`ticket-deny`)
            .setLabel("No")
            .setStyle(4)
        );

        const componentrows = [];
        const row = new MessageActionRow().addComponents(components);
        componentrows.push(row);

        interaction.editReply({embeds: [ticketEmbed], components: componentrows});
    },
    async createTicket(interaction){
        const ticketType = interaction.customId.split('-')[2];

        const ticket = await ticketManager.createTicket(interaction.user, ticketType, interaction.guild);
        await interaction.editReply({content: `A ticket has been opened! <#${ticket.channelid}>`});
    },
    async deny(interaction){
        const ticketEmbed = new EmbedBuilder();
        ticketEmbed.setColor(0x00FFFF);
        ticketEmbed.setTitle("Cancelled creating a ticket!");
        ticketEmbed.setDescription("Cancelled ticket creation. Make sure to create a ticket in the future if you do have something to talk to us about.");

        interaction.editReply({embeds: [ticketEmbed]});
    }
};