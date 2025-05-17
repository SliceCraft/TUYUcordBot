import SkullBoard from "../../../libraries/skullboard/SkullBoard.js";

export default {
    name: 'messageReactionAdd',
    async execute(){
        client.on('messageReactionAdd', async function(reaction) {
            if(reaction.partial) await reaction.fetch();
            if(reaction.message.partial) await reaction.message.fetch();

            SkullBoard.messageReactionAdd(reaction);
        });
    }
};