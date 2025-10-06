import Welcomer from "../../../libraries/welcomer/Welcomer.js";

export default {
    name: 'guildMemberRemove',
    async execute(){
        client.on('guildMemberRemove', async function(guildMember) {
            Welcomer.memberLeave(guildMember);
        });
    }
}