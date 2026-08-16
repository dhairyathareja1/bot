"use strict";
// Description:
//   gets MDG member's info from google doc
//   Type a partial name to get all matches
//
// Configuration:
//   INFO_SPREADSHEET_URL
//
// Commands:
//   hubot info <partial name> - Get information about a person
// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require("moment");
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
    /* BUGFIX: original CoffeeScript was `if result != "" then result else false`.
     `result` is always an array, never `!=`-equal to a string in a way that
     resolves false, so that comparison was always true — the `else false`
     branch never ran. parse() always returned the array (even empty), never
     `false`, which made the `if (!result)` "not found" message below
     unreachable. Fixed here so an empty match set now correctly reports
     "no user found" instead of silently sending zero attachments. */
    return result;
}
function randomColor() {
    return "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).slice(1, 7);
}
module.exports = (robot) => {
    robot.respond(/(info) (.+)$/i, (msg) => {
        const query = msg.match[2].toLowerCase();
        util.info((body) => {
            const result = parse(body, query);
            if (!result) {
                msg.send("I could not find a user matching `" + query.toString() + "`");
            }
            else {
                msg.send(result.length + " user(s) found matching `" + query.toString() + "`");
                for (const user of result) {
                    msg.send({
                        attachments: [
                            {
                                fallback: user.join(" \t "),
                                color: randomColor(),
                                title: user[0],
                                title_link: `https://facebook.com/${user[9]}`,
                                text: `Github: <https://github.com/${user[8]}|${user[8]}>` +
                                    `\nRoom no: ${user[7]}`,
                                fields: [
                                    {
                                        title: "Mobile",
                                        value: `<tel:${user[1]}|${user[1]}>`,
                                        short: true,
                                    },
                                    {
                                        title: "Email",
                                        value: `<mailto:${user[2]}|${user[2]}>`,
                                        short: true,
                                    },
                                ],
                                footer: `${user[4]} ${user[5]} (${user[6]})`,
                                ts: moment(user[3], "DD/MM/YYYY").format("X"),
                            },
                        ],
                    });
                }
            }
        });
    });
};
//# sourceMappingURL=info.js.map