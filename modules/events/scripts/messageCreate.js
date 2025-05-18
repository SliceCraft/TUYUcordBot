import JapaneseChannelTranslator from "../../../libraries/translator/JapaneseChannelTranslator.js";
import TicketManager from "../../../libraries/tickets/TicketManager.js";

export default {
    name: 'messageCreate',
    async execute(){
        client.on('messageCreate', async function(message) {
            JapaneseChannelTranslator.onMessageCreate(message);
            TicketManager.onMessageCreate(message);
        });
    }
}