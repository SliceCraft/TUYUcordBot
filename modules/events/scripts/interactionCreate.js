export default {
    name: 'interactionCreate',
    async execute(){
        client.on('interactionCreate', async function(interaction) {
            if (interaction.isCommand()) {
                if(!interaction.guild && client.commands.get(interaction.commandName).guildOnly == true) return interaction.reply({ content: `This command is guild only`, ephemeral: true });
                try{
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " called command " + interaction.commandName);
                    await client.commands.get(interaction.commandName).execute(interaction);
                }catch(err){
                    console.log("User " + interaction.user.username + " called command " + interaction.commandName + " and resulted in the error: " + err);
                    console.log(err);
                    await interaction.reply({ content: "Something went wrong", ephemeral: true });
                }
            }else if(interaction.isStringSelectMenu()){
                try{
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " edited a select menu in the command " + interaction.message.interaction.commandName ?? interaction.message.interaction.name);
                    // With subcommands there can be a command like `roles pick` this causes the get to fail
                    // To fix this I split at spaces and get the first result
                    var commandname = (interaction.message.interaction.commandName ?? interaction.message.interaction.name).split(" ")[0];
                    await client.commands.get(commandname).select(interaction);
                }catch(err){
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " edited a select menu in the command " + interaction.message.interaction.commandName ?? interaction.message.interaction.name + " and resulted in the error: " + err);
                    console.log(err);
                    await interaction.reply({ content: "Something went wrong", ephemeral: true });
                }
            }else if(interaction.isButton()){
                try{
                    // With subcommands there can be a command like `roles pick` this causes the get to fail
                    // To fix this I split at spaces and get the first result
                    var commandname = (interaction.message.interaction == null ? interaction.customId.split('-')[0] : interaction.message.interaction.commandName ?? interaction.message.interaction.name).split(" ")[0];

                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " clicked on a button in the command " + commandname);
                    await client.commands.get(commandname).button(interaction);
                }catch(err){
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " clicked on a button in the comman " + commandname + " and resulted in the error: " + err);
                    console.log(err);
                    await interaction.reply({ content: "Something went wrong", ephemeral: true });
                }
            }else if(interaction.isAutocomplete()){
                try{
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " is calling for autocomplete of command " + interaction.commandName);
                    await client.commands.get(interaction.commandName).autocomplete(interaction);
                }catch(err){
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " called for autocomplete of command " + interaction.commandName + " and resulted in the error: " + err);
                    console.log(err);
                }
            }else if(interaction.isModalSubmit()){
                try{
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " submitted a modal of command " + interaction.customId.split("-")[0]);
                    await client.commands.get(interaction.customId.split("-")[0]).modalSubmit(interaction);
                }catch(err){
                    console.log("User " + interaction.user.username + "#" + interaction.user.discriminator + " submitted a modal of command " + interaction.customId.split("-")[0] + " and resulted in the error: " + err);
                    console.log(err);
                }
            }
        });
    }
};