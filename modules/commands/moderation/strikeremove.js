import StrikeUser from "../../../libraries/strikes/StrikeUser.js";
import strikeUser from "../../../libraries/strikes/StrikeUser.js";
import RoleChecker from "../../../libraries/permissions/RoleChecker.js";

export default {
    "name": "strikeremove",
    "category": "moderation",
    "description": "Remove a strike from a member",
    "options": [
        {
            name: "user",
            description: "The user you want to remove a strike from",
            type: "USER",
            required: true
        },
        {
            name: 'strike',
            description: 'The strike you want to remove',
            type: 'STRING',
            required: true,
            autocomplete: true
        }
    ],
    async execute(interaction){
        if (!RoleChecker.isTrialOrAbove(interaction.member)) {
            await interaction.reply({content: "You are not allowed to execute this command!", ephemeral: true})
            return;
        }

        await interaction.deferReply({ephemeral: true});

        let user = interaction.options.getUser('user');
        let strike = interaction.options.getString('strike');

        let strikeUser = StrikeUser.getUser(user.id);
        let succeeded = strikeUser.disableStrike(strike);
        strikeUser.save();

        if (succeeded) {
            await interaction.editReply({content: 'Strike removed successfully'});
        } else {
            await interaction.editReply({content: 'Failed to remove strike, did you specify a real strike?'});
        }
    },
    async autocomplete(interaction){
        if (!RoleChecker.isTrialOrAbove(interaction.member)) {
            // Since the user isn't allowed to run this command they shouldn't get any strikes
            await interaction.respond([]);
            return;
        }

        // This is a bad way to get the user value but for some reason `interaction.options.getUser('user')`
        // returns null instead of a user.
        let userid = interaction.options._hoistedOptions[0].value;
        let strikeUser = StrikeUser.getUser(userid);
        let strikes = strikeUser.getNonDisabledStrikes().map(strike => {
            return {name: strike.reason.substring(0, 30), value: strike.uuid};
        });

        let currentinput = interaction.options.getFocused(true);

        let potentialresults = [];
        let rest = [];
        for(let strike of strikes){
            if(strike.name.toLowerCase().startsWith(currentinput.value.toLowerCase())) potentialresults.push(strike)
            else rest.push(strike);
        }

        await interaction.respond([...potentialresults, ...rest].slice(0, 25));
    }
};