export default {
    name: 'threadCreate',
    async execute(){
        client.on('threadCreate', async function(channel) {
            client.channels.cache.get(process.env.SERVER_MODERATION_CHANNEL).send({
                "content": `Thread <#${channel.id}> was opened in channel <#${channel.parentId}>`
            });
        });
    }
};