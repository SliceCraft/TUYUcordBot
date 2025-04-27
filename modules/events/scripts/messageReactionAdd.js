import * as fs from "fs";
import {EmbedBuilder} from "discord.js";

export default {
    name: 'messageReactionAdd',
    async execute(){
        client.on('messageReactionAdd', async function(reaction) {
            if(reaction.partial) await reaction.fetch();
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.emoji.toString() != "💀" || reaction.count < process.env.SKULLBOARD_MINIMUM_AMOUNT){
                console.log("NO SJKUL MOEJIIIII");
                return;
            }

            var skullEmojis = getSkullEmojis();
            var message = reaction.message;

            if(skullEmojis[message.id]) return;

            skullEmojis[message.id] = true;

            const embed = new EmbedBuilder()
                .setTitle("SKULL EMOJI")
                .setURL(message.url)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setTimestamp();

            if (message.attachments.size > 0) {
                embed.setImage(message.attachments.first().url);
            }

            if (message.content !== "") {
                embed.setDescription(message.content);
            }

            client.channels.cache.get(process.env.SKULLBOARD_CHANNEL).send({embeds: [embed]});

            writeSkullEmojis(skullEmojis);
        });
    }
};

function getSkullEmojis(){
    if(!fs.existsSync("./data/skullemojis.json")){
        writeSkullEmojis({});
    }

    return JSON.parse(fs.readFileSync("./data/skullemojis.json", "utf8"));
}

function writeSkullEmojis(skullEmojis){
    fs.writeFileSync("./data/skullemojis.json", JSON.stringify(skullEmojis));
}