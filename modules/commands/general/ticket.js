import TicketManager from "../../../libraries/tickets/TicketManager.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";
import {PermissionsBitField} from "discord.js";

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
                            name: 'Appeal (NOT FULLY IMPLEMENTED)', value: 'appeal'
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

        // TODO: Add ticket cleanup

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
    }
};