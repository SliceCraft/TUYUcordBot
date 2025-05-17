import Translator from "./Translator.js";

class JapaneseChannelTranslator {
    static async onMessageCreate(message) {
        if(message.channel.id != process.env.JAPANESE_CHANNEL) return

        // Make sure that the text contains japanese characters so we don't send a request when there are none
        if(/[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g.test(message.content)){
            try{
                var translatedText = (await Translator.translateString(message.content)).translations[0].text;

                // We replace the linebreaks with '<br>' because linebreaks will cause unnecessary splits.
                // These <br> elements are later replaced with real linebreaks.
                // This way a <br> element can be split in half but since this is purely visible for moderators I
                // don't think that this is that big of an issue.
                var textSeparated = translatedText.replaceAll('\n', '<br>').match(/.{1,1900}/g);

                textSeparated.forEach(translation => {
                    message.guild.channels.cache.get(process.env.JAPANESE_MOD_CHANNEL).send({content: `${message.url}\n${translation.replaceAll('<br>', '\n')}`});
                });
            }catch(err){}
        }
    }
}

export default JapaneseChannelTranslator;