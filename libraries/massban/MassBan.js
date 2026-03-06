import {ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle} from "discord.js";
import RoleChecker from "../permissions/RoleChecker.js";

class MassBan {
    static banList = [];
    static banInProgres = false;
    static initiator = -1;

    static requestConfirmation()
    {
        var serverModerationChannel = client.channels.cache.get(process.env.SERVER_MODERATION_CHANNEL);

        var confirmationEmbed = new EmbedBuilder()
        confirmationEmbed.setTitle("Confirm a mass ban");
        confirmationEmbed.setColor(0x00EEFF);
        confirmationEmbed.setDescription(`A mass ban was requested, please confirm if this is correct! The list contains ${MassBan.banList.length} users!`);

        let buttonRow = new ActionRowBuilder().addComponents([
            new ButtonBuilder()
                .setCustomId("massban-confirm")
                .setLabel("Confirm")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId("massban-deny")
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
        ]);

        serverModerationChannel.send({content: `<@&${process.env.MOD_ROLE}> <@&${process.env.ADMIN_ROLE}> <@&${process.env.HEAD_ADMIN_ROLE}>`, components: [buttonRow], embeds: [confirmationEmbed]})
    }

    static async modalSubmit(interaction)
    {
        if (!RoleChecker.isModOrAbove(interaction.member)) {
            await interaction.reply({content: "You are not allowed to interact with this message!", ephemeral: true})
            return;
        }

        if (MassBan.banInProgres === false) {
            await interaction.reply({ephemeral: true, content: "No mass ban is currently in progress."});
        } else if (interaction.customId.endsWith('confirm')) {
            if (interaction.member.id != MassBan.initiator) {
                await MassBan.confirm(interaction);
            } else {
                await interaction.reply({ephemeral: true, content: "As the initiator of the mass ban you can't confirm it"})
                return;
            }
        } else if (interaction.customId.endsWith('deny')) {
            await MassBan.deny(interaction);
        }

        await interaction.message.delete();
    }

    static async confirm(interaction)
    {
        await interaction.deferReply();

        var guild = client.guilds.cache.get(process.env.DEPLOY_GUILD);
        await guild.members.bulkBan(MassBan.banList, {reason: "Mass ban most likely due to a raid"});

        await interaction.editReply({content: `Mass ban executed, initiated by <@${interaction.member.id}> and approved by <@${interaction.member.id}>`});

        MassBan.banInProgres = false;
        MassBan.banList = [];
        MassBan.initiator = -1;
    }

    static async deny(interaction)
    {
        await interaction.reply({content: `Mass ban has been initiated by <@${MassBan.initiator}> and denied by <@${interaction.member.id}>`});

        MassBan.banInProgres = false;
        MassBan.banList = [];
        MassBan.initiator = -1;
    }
}

export default MassBan;