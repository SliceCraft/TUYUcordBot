import StrikeUser from "./StrikeUser.js";

class BanChecker {
    static async onJoin(member) {
        await this.checkBan(member);
    }

    static async onStartup(){
        let guild = client.guilds.cache.get(process.env.DEPLOY_GUILD)
        await guild.members.fetch()
        for (let member of guild.members.cache.map(user => user)){
            if (!member.roles.cache.has(process.env.BAN_ROLE)) await this.checkBan(member);
        }
    }

    static async checkBan(member){
        let strikeUser = StrikeUser.getUser(member.id);

        if (strikeUser.getBannedAt() !== null) {
            await member.roles.add(process.env.BAN_ROLE);
        }
    }
}

export default BanChecker;