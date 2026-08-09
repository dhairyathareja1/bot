"use strict";
// Description:
//   Script for updating names database
//
// Commands:
//   hubot update db
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require("https");
const token = process.env.SLACK_API_TOKEN;
module.exports = (robot) => {
    if (!token) {
        // console.log("No slack Api token found")
        return;
    }
    let parsedUsers = 0;
    let updatedUsers = 0;
    let totalUsers = 0;
    let currentRoom = null;
    const updateName = (uid) => {
        const pre = "/api/users.info?token=";
        const post = "&user=";
        const url = pre + token + post + uid;
        let output = "";
        https.get({ host: "slack.com", path: url }, (res) => {
            res.on("data", (chunk) => {
                output += chunk;
            });
            res.on("end", () => {
                parsedUsers++;
                const data = JSON.parse("" + output);
                if (data.ok) {
                    const user = robot.brain.userForId(data.user.id);
                    if (user.name !== data.user.name) {
                        user.name = data.user.name;
                        updatedUsers++;
                    }
                }
                if (parsedUsers === totalUsers) {
                    robot.send({ room: currentRoom }, `Updated names for ${updatedUsers} out of ${totalUsers} users`);
                }
            });
        });
    };
    robot.respond(/update db/i, (msg) => {
        msg.send("Updating names in database");
        currentRoom = msg.message.user.room || null;
        parsedUsers = 0;
        updatedUsers = 0;
        totalUsers = Object.keys(robot.brain.data.users).length;
        for (const key of Object.keys(robot.brain.data.users)) {
            updateName(robot.brain.data.users[key].id);
        }
    });
};
//# sourceMappingURL=update-names.js.map