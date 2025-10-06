class Welcomer {
    static async memberLeave(member) {
        let guild = client.guilds.cache.get(process.env.DEPLOY_GUILD);
        let channel = guild.channels.cache.get(process.env.WELCOME_NOT_CHANNEL);
        let nicknameAddon = member.nickname != null ? `(also known with the nickname ${member.nickname}) ` : ''
        channel.send({
            'content': `User ${member.user.displayName} ${nicknameAddon}with the username ${member.user.username} and id ${member.id} has left the server`
        });
    }
}

export default Welcomer;