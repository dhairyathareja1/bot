"use strict";
// Description:
//   cron jobs for managing the MDG Mirror Spreadsheet
//
//   1) Adds new week column in the sheet every Sunday 9 pm.
//   2) Reminds those who have not filled the sheet every Tuesday and Friday at 6 am.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require("follow-redirects").https;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require("node-cron");
let output = "";
module.exports = (robot) => {
    const url = process.env.MIRROR_SCRIPT_URL;
    if (url) {
        // This will run every Sunday at 9 pm
        cron.schedule("0 0 21 * * Sunday", () => {
            https.get(url + "?type=3", (res) => {
                res.on("data", (body) => {
                    output += body;
                });
                res.on("end", () => {
                    robot.send({ room: "general" }, `Added new week to Mdg Mirror. (${output})`);
                    output = "";
                });
            });
        });
        // This will run every Tuesday and Friday at 6 am
        cron.schedule("0 0 6 * * Tuesday,Friday", () => {
            https.get(url + "?type=2", (res) => {
                res.on("data", (body) => {
                    output += body;
                });
                res.on("end", () => {
                    let namesArray = JSON.parse(output);
                    if (!namesArray.length) {
                        return;
                    }
                    namesArray = namesArray.map((el) => "@" + el);
                    const names = namesArray.join(" ");
                    robot.send({ room: "general" }, names + "\nPlease fill up the activities sheet.");
                    output = "";
                });
            });
        });
    }
    // else
    // console.log "MIRROR_SCRIPT_URL not found in environment variables"
};
//# sourceMappingURL=mirror.js.map