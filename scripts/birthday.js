"use strict";
// Description:
//   Script for birthdays!.
//
// Configuration:
//   INFO_SPREADSHEET_URL
//
// Commands:
//   hubot birthday <user>
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require("moment");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require("node-cron");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require("./util");
function parse(json, query) {
    const result = [];
    for (const line of json.toString().split("\n")) {
        const y = line.toLowerCase().indexOf(query);
        if (y !== -1) {
            result.push(line.split(",").map((s) => s.trim()));
        }
    }
    return result.length ? result : false;
}
module.exports = (robot) => {
    robot.respond(/(birthday) (.+)$/i, (msg) => {
        const query = msg.match[2].toLowerCase();
        util.info((body) => {
            const result = parse(body, query);
            if (!result) {
                msg.send("I could not find a user matching `" + query.toString() + "`");
            }
            else {
                msg.send(result.length + " user(s) found matching `" + query.toString() + "`");
                for (const user of result) {
                    if (user[3] === "") {
                        msg.send(`${user[0]} bro add karde yrr!`);
                    }
                    else {
                        msg.send(`Wish ${user[0]} on ${moment(user[3], "DD/MM/YYYY").format("MMM Do, YYYY")}!`);
                    }
                }
            }
        });
    });
    // This will run every day at 00:00:05
    cron.schedule("5 0 0 * * *", () => {
        util.info((body) => {
            const result = parse(body, "/");
            if (!result) {
                return;
            }
            for (const member of result) {
                try {
                    const dob = moment(member[3], "DD/MM/YYYY");
                    const today = moment();
                    if (dob.format("D") === today.format("D") &&
                        dob.format("M") === today.format("M") &&
                        Number(member[6]) > 15000000) {
                        robot.send({ room: "general" }, `Happy Birthday ${member[0]}:birthday::birthday:!!`);
                    }
                }
                catch (error) {
                    robot.send({ room: "general" }, "Help!! These dates are breaking me!");
                }
            }
        });
    });
};
//# sourceMappingURL=birthday.js.map