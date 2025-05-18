import TicketManager from "../../../libraries/tickets/TicketManager.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";

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
                },
                {
                    name: 'ticket',
                    description: 'The ticket you want to add the user to',
                    type: 'CHANNEL',
                    channel_types: ["GUILD_TEXT"],
                    required: false
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
                },
                {
                    name: 'ticket',
                    description: 'The ticket you want to remove the user from',
                    type: 'CHANNEL',
                    channel_types: ["GUILD_TEXT"],
                    required: false
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

    },
    async addUser(interaction){

    },
    async removeUser(interaction){

    }
};