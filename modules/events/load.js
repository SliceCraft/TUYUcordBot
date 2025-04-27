import * as fs from "fs";

async function run() {
    let eventFiles = fs.readdirSync("./modules/events/scripts/");
    console.log("Loading events");
    for(let event of eventFiles){
        let eventFile = (await import(`./scripts/${event}`)).default;
        console.log("Loading event: " + eventFile.name);
        await eventFile.execute();
    }
    console.log("Finished loading events");
}

export {
    run
}