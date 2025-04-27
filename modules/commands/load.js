import * as discord from "discord.js";
import * as fs from "fs";

async function run() {
    console.log("Loading commands");
    let categories = fs.readdirSync("./modules/commands/");
    // Make a new collection
    client.commands = new discord.Collection();
    for(let category of categories){
        if(category == "load.js") continue;
        console.log("Loading category: " + category);
        // Read all javascript files in the folder commands
        let commandFiles = fs.readdirSync(`./modules/commands/${category}/`).filter(file => file.endsWith('.js'));
        // For every file get the info and the code that needs to be executed
        for(let file of commandFiles){
            let command = (await import(`./${category}/${file}`)).default;
            console.log("Loading command: " + command.name);
            client.commands.set(command.name, command);
            if(command.aliases){
                let commandCopy = Object.assign({}, command);
                commandCopy.isAlias = true;
                command.aliases.forEach(alias => {
                    console.log("Loading command: " + command.name + " with alias: " + alias);
                    client.commands.set(alias, commandCopy);
                });
            }
        }
    }
    console.log("Finished loading commands");
}

export {
    run
};