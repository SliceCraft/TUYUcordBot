import fs from "fs";
import Strike from "./Strike.js";

class StrikeUser {
    #strikes;

    constructor(userid, userdata) {
        this.userid = userid;
        this.#strikes = [];

        if(userdata.strikes) {
            for(let strike of userdata.strikes) {
                this.#strikes.push(new Strike(strike.createdAt, strike.reason, strike.punisher));
            }
        }
    }

    static getUser(userid) {
        let userData;

        if (fs.existsSync(`./data/strikes/${userid}.json`)) {
            userData = JSON.parse(fs.readFileSync(`./data/strikes/${userid}.json`));
        } else {
            userData = {};
        }

        return new StrikeUser(userid, userData);
    }

    addStrike(reason, punisher){
        let strike = new Strike(Date.now(), reason, punisher);

        this.#strikes.push(strike);

        return strike;
    }

    save(){
        fs.writeFileSync(`./data/strikes/${this.userid}.json`, JSON.stringify({
            strikes: this.#strikes
        }));
    }
}

export default StrikeUser;