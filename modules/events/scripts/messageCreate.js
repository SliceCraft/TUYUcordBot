import JapaneseChannelTranslator from "../../../libraries/translator/JapaneseChannelTranslator.js";

export default {
    name: 'messageCreate',
    async execute(){
        client.on('messageCreate', async function(message) {
            JapaneseChannelTranslator.onMessageCreate(message);
        });
    }
}