import StrikeUser from "../../../libraries/strikes/StrikeUser.js";
import {EmbedBuilder} from "discord.js";
import StrikeChannelAnnouncementManager from "../../../libraries/strikes/StrikeChannelAnnouncementManager.js";

/**
 * Create an embed for the member about the strike they received
 * @param strike The strike that was just given to them
 * @param strikeUser The strike user instance containing info about the user strikes
 * @returns EmbedBuilder The constructed embed
 */
function createStrikeAwardEmbed(strike, strikeUser){
    let strikeAwardedEmbed = new EmbedBuilder();
    strikeAwardedEmbed.setColor(0xFF0000);
    strikeAwardedEmbed.setTitle('You got a strike!');
    strikeAwardedEmbed.setDescription(`
        A moderator gave you a strike, you now have ${strikeUser.getActiveStrikeCount()} active strikes.
        If you reach 3 strikes you will get banned from the server.
        
        The reason provided by the moderator is as follows:
        ${strike.reason}
    `);

    return strikeAwardedEmbed;
}

/**
 * Send a dm to the member about the strike they received
 * @param user The user getting the strike
 * @param strike The strike that was just given to them
 * @param strikeUser The strike user instance containing info about the user strikes
 * @returns {Promise<boolean>} Whether sending the dm succeeded
 */
async function sendDmToMember(user, strike, strikeUser) {
    try {
        await user.send({
            embeds: [createStrikeAwardEmbed(strike, strikeUser)],
        })
    } catch {
        return false;
    }
    return true;
}

/**
 * Create a temporary channel for a member about the strike they received
 * @param user The user getting the strike
 * @param strike The strike that was just given to them
 * @param strikeUser The strike user instance containing info about the user strikes
 */
async function createTempStrikeChannel(user, strike, strikeUser){
    let channel = await StrikeChannelAnnouncementManager.createChannel(user);
    StrikeChannelAnnouncementManager.addChannel(channel.id, user.id);

    channel.send({
        content: `<@${user.id}>`,
        embeds: [createStrikeAwardEmbed(strike, strikeUser)],
    });
}

export default {
    "name": "strike",
    "category": "moderation",
    "description": "Give a member a strike",
    "options": [
        {
            name: "user",
            description: "The user you want to give a strike",
            type: "USER",
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for giving a strike',
            type: 'STRING',
            required: true
        }
    ],
    async execute(interaction){
        await interaction.deferReply({ephemeral: true});

        let user = interaction.options.getUser('user');
        let reason = interaction.options.getString('reason');

        let strikeUser = StrikeUser.getUser(user.id);

        let strike = strikeUser.addStrike(reason, interaction.user.id);

        let dmSucceeded = await sendDmToMember(user, strike, strikeUser);

        if (!dmSucceeded) {
            await createTempStrikeChannel(user, strike, strikeUser);
        }

        if (strikeUser.getActiveStrikeCount() >= 3 && strikeUser.getBannedAt() === null) {
            strikeUser.ban();
            let member = interaction.guild.members.cache.get(user.id);
            await member.roles.add(process.env.BAN_ROLE);
        }
        strikeUser.save();

        await interaction.editReply({content: 'Strike added successfully'});
    }
};