import fs from "fs";
import Strike from "./Strike.js";

class StrikeUser {
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
        let userData = JSON.parse(fs.getFileSync(`./data/strikes/${userid}.json`));
        if(!userData) userData = {};
        return new Strike(userData);
    }

    addStrike(reason, punisher){
        this.#strikes.push(new Strike(Date.now(), reason, punisher));
    }

    save(){
        fs.writeFileSync(`./data/strikes/${this.userid}.json`, JSON.stringify({
            strikes: this.#strikes
        }));
    }
}

export default StrikeUser;