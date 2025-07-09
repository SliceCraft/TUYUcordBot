import fs from "fs";
import Strike from "./Strike.js";

/**
 * @type {number} The delta between each strike expire
 */
const STRIKE_EXPIRE_DELTA = 90 * 24 * 60 * 60 * 1000;

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

    getActiveStrikes(){
        let sortedStrikes = this.#strikes.sort((a,b) => a.createdAt - b.createdAt);

        let strikesForgiven = 0;

        for(let i = 0; i < sortedStrikes.length; i++){
            let strike = sortedStrikes[i];
            let nextStrike = sortedStrikes[i + 1];

            let currentStrikeTimestamp = strike.createdAt;
            let nextStrikeTimestamp = nextStrike ? nextStrike.createdAt : Date.now();

            let newStrikesForgiven = strikesForgiven + Math.floor((nextStrikeTimestamp - currentStrikeTimestamp) / STRIKE_EXPIRE_DELTA)

            // You can't forgive more strikes then you already have
            // To prevent this from happening we only allow i + 1 (the current amount of strikes) to be forgiven
            strikesForgiven = Math.min(newStrikesForgiven, i + 1);
        }

        for(let i = 0; i < sortedStrikes.length; i++){
            let strike = sortedStrikes[i];

            if(i < strikesForgiven) {
                strike.active = false;
            }else{
                strike.active = true;
            }
        }

        return sortedStrikes;
    }

    getStrikeCount(){
        return this.#strikes.length;
    }

    getActiveStrikeCount(){
        return this.getActiveStrikes().filter(strike => strike.active).length;
    }
}

export default StrikeUser;