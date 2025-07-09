import StrikeUser from "../../../libraries/strikes/StrikeUser.js";
import {EmbedBuilder} from "discord.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";

export default {
    "name": "strikes",
    "category": "moderation",
    "description": "Check the amount of strikes you have",
    "options": [
        {
            name: "user",
            description: "The user you want check (staff only)",
            type: "USER",
            required: false
        }
    ],
    async execute(interaction){
        const isTrialOrAbove = RoleChecker.isTrialOrAbove(interaction.member);

        const user = (
            interaction.options.getUser("user") &&
            isTrialOrAbove
        ) ? interaction.options.getUser("user") :
            interaction.member.user;

        let strikeUser = StrikeUser.getUser(user.id);
        let strikes = isTrialOrAbove ? strikeUser.getActiveStrikes() : strikeUser.getActiveStrikes().filter(strike => strike.active);

        let strikeCount = strikeUser.getStrikeCount();
        let activeStrikeCount = strikeUser.getActiveStrikeCount();

        let strikeMessage = `Strikes ever received: ${strikeCount}\nCurrently active strikes: ${activeStrikeCount}\n`;

        if(activeStrikeCount > 0) {
            let timestampNextExpiry = Date.now() + (StrikeUser.STRIKE_EXPIRE_DELTA - ((Date.now() - strikes[strikes.length - 1].createdAt) % StrikeUser.STRIKE_EXPIRE_DELTA));
            strikeMessage += `Next strike expires at: <t:${Math.floor(timestampNextExpiry / 1000)}>\n`;
        }

        if(isTrialOrAbove) {
            strikeMessage += `All strikes:\n`;
        }else{
            strikeMessage += `Currently active strikes:\n`;
        }

        for(let i = 0; i < strikes.length; i++) {
            let strike = strikes[i];
            strikeMessage += `${i + 1}. ${strike.reason} <t:${Math.floor(strike.createdAt / 1000)}>`;
            if(isTrialOrAbove) {
                strikeMessage += ` (Active: ${strike.active})`;
            }
            strikeMessage += `\n`;
        }

        let strikesEmbed = new EmbedBuilder();
        strikesEmbed.setTitle('Your strikes');
        strikesEmbed.setDescription(strikeMessage);
        strikesEmbed.setColor(0x00FFFF);

        interaction.reply({embeds: [strikesEmbed], ephemeral: true});
    }
};