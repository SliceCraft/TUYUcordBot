import BanChecker from "../../../libraries/strikes/BanChecker.js";

export default {
    name: 'guildMemberAdd',
    async execute(){
        client.on('guildMemberAdd', async function(guildMember) {
            BanChecker.onJoin(guildMember);
        });
    }
}