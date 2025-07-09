import fs from "fs";
import {ChannelType, PermissionsBitField} from "discord.js";

/**
 * @type {number} The amount of time before an announcement channel should be deleted
 */
const CHANNEL_DELETION_DELTA = 4 * 24 * 60 * 60 * 1000;

class StrikeChannelAnnouncementManager {
    static getData(){
        if(fs.existsSync('./data/strikechannels.json')){
            return JSON.parse(fs.readFileSync('./data/strikechannels.json'));
        }
        return [];
    }

    static #saveData(data){
        fs.writeFileSync('./data/strikechannels.json', JSON.stringify(data));
    }

    static addChannel(channelid, userid){
        let data = this.getData();
        data.push({
            id: channelid,
            userid: userid,
            createdAt: Date.now()
        });
        this.#saveData(data);
    }

    static deleteChannel(id){
        let data = this.getData();
        this.#saveData(data.filter(a => a.id !== id));
    }

    static async createChannel(user){
        const guild = client.guilds.cache.get(process.env.DEPLOY_GUILD);
        const everyoneRole = guild.roles.cache.find(r => r.name === '@everyone');

        return await guild.channels.create({
            name: `strike-${user.username}`,
            type: ChannelType.GuildText,
            parent: process.env.STRIKE_CATEGORY,
            permissionOverwrites: [
                {
                    id: user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
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
    }

    static async cleanUp(){
        let data = this.getData().filter(channel => channel.createdAt < Date.now() - CHANNEL_DELETION_DELTA);

        for (let channel of data){
            let textChannel = await client.guilds.cache.get(process.env.DEPLOY_GUILD).channels.fetch(channel.id);
            if(textChannel) await textChannel.delete();
            this.deleteChannel(channel.id);
        }
    }
}

export default StrikeChannelAnnouncementManager;