import StrikeUser from "../../../libraries/strikes/StrikeUser.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";

export default {
    "name": "unban",
    "category": "moderation",
    "description": "Unban a member",
    "options": [
        {
            name: "user",
            description: "The user you want to unban",
            type: "USER",
            required: true
        }
    ],
    async execute(interaction){
        if (!RoleChecker.isTrialOrAbove(interaction.member)) {
            await interaction.reply({content: "You are not allowed to execute this command!", ephemeral: true})
            return;
        }

        await interaction.deferReply({ephemeral: true});

        let user = interaction.options.getUser('user');

        let strikeUser = StrikeUser.getUser(user.id);
        strikeUser.unban();
        strikeUser.save();

        let member = interaction.guild.members.cache.get(user.id);
        await member.roles.remove(process.env.BAN_ROLE);

        await interaction.editReply({content: 'User has been unbanned'});
    }
};