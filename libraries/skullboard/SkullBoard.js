import {EmbedBuilder} from "discord.js";
import fs from "fs";

class SkullBoard {
    static messageReactionAdd(reaction){
        if(reaction.emoji.toString() !== "💀" || reaction.count < process.env.SKULLBOARD_MINIMUM_AMOUNT){
            return;
        }

        let message = reaction.message;
        if (message.author.id === client.user.id) return;

        let skullEmojis = this.getSkullEmojiFile();

        // If the message was already posted on the skull board then we don't need to post it again
        if(skullEmojis[message.id]) return;
        skullEmojis[message.id] = true;

        const embed = this.createSkullBoardEmbed(message);

        client.channels.cache.get(process.env.SKULLBOARD_CHANNEL).send({embeds: [embed]});

        this.writeSkullEmojiFile(skullEmojis);
    }

    static getSkullEmojiFile(){
        if(!fs.existsSync("./data/skullemojis.json")){
            this.writeSkullEmojiFile({});
        }

        return JSON.parse(fs.readFileSync("./data/skullemojis.json", "utf8"));
    }

    static writeSkullEmojiFile(skullEmojiData){
        fs.writeFileSync("./data/skullemojis.json", JSON.stringify(skullEmojiData));
    }

    static createSkullBoardEmbed(message){
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

        return embed;
    }
}

export default SkullBoard;