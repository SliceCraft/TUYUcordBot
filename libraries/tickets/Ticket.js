import fs from "fs";
import {EmbedBuilder, ChannelType} from "discord.js";

class Ticket {
    constructor(data = {}) {
        this.userid = data.userid;
        this.channelid = data.channelid;
        this.threadid = data.threadid;
        this.type = data.type;
    }

    save(){
        if(!fs.existsSync(`./data/tickets/${this.channelid}`)){
            const time = new Date();
            fs.mkdirSync(`./data/tickets/${this.channelid}`);
            fs.writeFileSync(`./data/tickets/${this.channelid}/logs.txt`, `Ticket was created for ${this.userid}.\nThe channelid for this ticket is ${this.channelid}.\nThe type of ticket is ${this.type}.\nCreated on: ${time.toLocaleDateString() + " " + time.toLocaleTimeString()}\n`);
            fs.writeFileSync(`./data/tickets/${this.channelid}/stafflogs.txt`, `Ticket was created for ${this.userid}.\nThe channelid for this ticket is ${this.channelid}.\nThe threadid for this ticket is ${this.threadid}\nThe type of ticket is ${this.type}.\nCreated on: ${time.toLocaleDateString() + " " + time.toLocaleTimeString()}\n`);
        }
        fs.writeFileSync(`./data/tickets/${this.channelid}/ticket.json`, JSON.stringify(this.toObject()));
    }

    appendMessage(message, isThread = false) {
        const time = new Date();

        if(isThread){
            fs.appendFileSync(`./data/tickets/${this.channelid}/stafflogs.txt`, `[${time.toLocaleDateString() + " " + time.toLocaleTimeString()}] [Sent in staff chat] ${message.member.user.username + "#" + message.member.user.discriminator}: ${message.content}\n`);
        }else{
            fs.appendFileSync(`./data/tickets/${this.channelid}/logs.txt`, `[${time.toLocaleDateString() + " " + time.toLocaleTimeString()}] ${message.member.user.username + "#" + message.member.user.discriminator}: ${message.content}\n`);
            fs.appendFileSync(`./data/tickets/${this.channelid}/stafflogs.txt`, `[${time.toLocaleDateString() + " " + time.toLocaleTimeString()}] [Sent in ticket chat] ${message.member.user.username + "#" + message.member.user.discriminator}: ${message.content}\n`);
        }
    }

    toObject(){
        return {
            userid: this.userid,
            channelid: this.channelid,
            threadid: this.threadid,
            type: this.type,
        }
    }

    async sendTicketOpenedMessage(){
        const ticketOpenedEmbed = new EmbedBuilder();
        ticketOpenedEmbed.setTitle("Ticket opened");
        ticketOpenedEmbed.setColor(0x00EEFF);
        ticketOpenedEmbed.setDescription(`Thanks for opening a ticket!\nPlease tell us what you need help with and we'll respond as soon as possible.\nTopic: ${this.type}`);

        const guild = client.guilds.cache.get(process.env.DEPLOY_GUILD);
        const channel = guild.channels.cache.get(this.channelid) ?? await guild.channels.fetch(this.channelid);
        await channel.send({embeds: [ticketOpenedEmbed]})
    }
}

export default Ticket;