import fs from "fs";
import Ticket from "./Ticket.js";
import {ChannelType, PermissionsBitField} from "discord.js";

class TicketManager {
    getTicket(channelid){
        if(!fs.existsSync(`./data/tickets/${channelid}/ticket.json`)) return false;
        const ticketData = JSON.parse(fs.readFileSync(`./data/tickets/${channelid}/ticket.json`));
        return new Ticket(ticketData);
    }

    async createTicket(user, type, guild) {
        const everyoneRole = guild.roles.cache.find(r => r.name === '@everyone');
        const category = guild.channels.cache.get(process.env.TICKET_CATEGORY) || await user.guild.channels.fetch(process.env.TICKET_CATEGORY);

        const channel = await guild.channels.create({
            name: `${type}-${user.username}`,
            type: ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
                }, {
                    id: everyoneRole.id,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                }, {
                    id: process.env.ADMIN_ROLE,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }, {
                    id: process.env.MOD_ROLE,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }, {
                    id: process.env.TRIAL_ROLE,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }, {
                    id: process.env.SERVER_TECHNICIAN_ROLE,
                    allow: [PermissionsBitField.Flags.ViewChannel]
                }, {
                    id: client.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles]
                }
            ],
        });

        const threadType = process.env.PRIVATE_THREADS_ENABLED === 'true' ? ChannelType.PrivateThread : ChannelType.PublicThread;
        const thread = await channel.threads.create({
            name: "Staff notes",
            autoArchiveDuration: 10080,
            type: threadType
        });
        await thread.send({content: `<@&${process.env.HEAD_ADMIN_ROLE}> <@&${process.env.ADMIN_ROLE}> <@&${process.env.MOD_ROLE}> <@&${process.env.TRIAL_ROLE}> <@&${process.env.SERVER_TECHNICIAN_ROLE}> This thread was made to privately discuss this ticket.`});

        const ticket = new Ticket({
            'userid': user.id,
            'channelid': channel.id,
            'threadid': thread.id,
            'type': type
        });

        ticket.save();
        await ticket.sendTicketOpenedMessage();

        return ticket;
    }

    static async onMessageCreate(message){
        const channelIsThread = message.channel.type === ChannelType.PrivateThread || message.channel.type === ChannelType.PublicThread;
        const channelId = channelIsThread ? message.channel.parentId : message.channel.id;
        const ticketManager = new TicketManager();
        const ticket = ticketManager.getTicket(channelId);
        if(!ticket){
            return;
        }

        ticket.appendMessage(message, channelIsThread);
    }
}

export default TicketManager;