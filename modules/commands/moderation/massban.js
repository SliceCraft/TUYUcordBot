import RoleChecker from "../../../libraries/permissions/RoleChecker.js";
import {FileUploadBuilder, LabelBuilder, ModalBuilder, TextInputBuilder} from "discord.js";
import MassBan from "../../../libraries/massban/MassBan.js";

export default {
    "name": "massban",
    "category": "moderation",
    "description": "Mass ban a lot of users",
    async execute(interaction){
        if (!RoleChecker.isModOrAbove(interaction.member)) {
            await interaction.reply({content: "You are not allowed to execute this command!", ephemeral: true})
            return;
        }

        var modal = new ModalBuilder()
            .setCustomId('massban')
            .setTitle('Mass ban');

        var useridFileUpload = new FileUploadBuilder()
            .setCustomId('userids');

        var label = new LabelBuilder()
            .setLabel('Upload list of userids')
            .setDescription('This list of userids should either be in a csv format or separated by new lines')
            .setFileUploadComponent(useridFileUpload);

        modal.addLabelComponents(label);

        await interaction.showModal(modal);
    },
    async modalSubmit(interaction) {
        if (!RoleChecker.isModOrAbove(interaction.member)) {
            await interaction.reply({content: "You are not allowed to execute this command!", ephemeral: true})
            return;
        }

        var file = interaction.fields.getUploadedFiles('userids').map(file => file)[0];

        var fetchedAttachment = await fetch(file.attachment);
        var fileContent = await fetchedAttachment.text()

        var userids = fileContent.split('\n').join(',').split(',').filter(row => row.length > 0);

        MassBan.banInProgres = true;
        MassBan.banList = userids;
        MassBan.initiator = interaction.member.id;

        MassBan.requestConfirmation();

        await interaction.reply({content: "Mass ban has been requested", ephemeral: true});
    }
}