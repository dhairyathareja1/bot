"use strict";
// Description:
//   Script for batch wise score.
//
// Configuration:
//   INFO_SPREADSHEET_URL
//
// Commands:
//   hubot score fxx -> for tabular representation
//   hubot score fxx -b -> for bar graph
//   hubot score fxx -p -> for pie graph
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require("./util");
function stringLength(str) {
    return String(str).split("").length;
}
// makes all the elements in the array equal in width by padding at right
function padright(array) {
    let maxLength = 0;
    for (const name of array) {
        maxLength =
            maxLength >= stringLength(name) ? maxLength : stringLength(name);
    }
    const padding = maxLength;
    for (let i = 0; i <= array.length - 1; i++) {
        let max = padding - stringLength(array[i]);
        if (i === 0) {
            max = max + 3;
        }
        if (max > 0) {
            for (let j = 0; j <= max - 1; j++) {
                array[i] += " ";
            }
        }
    }
    return array;
}
// makes all the elements in the array equal in width by padding at left
function padleft(array) {
    const padding = 5;
    for (let i = 0; i <= array.length - 1; i++) {
        const max = padding - stringLength(array[i]);
        let name = "";
        if (max > 0) {
            for (let j = 0; j <= max - 1; j++) {
                name += " ";
            }
        }
        name += array[i];
        array[i] = name;
    }
    return array;
}
function parse(json) {
    const result = [];
    for (const line of json.toString().split("\n")) {
        result.push(line.split(",").map((s) => s.trim()));
    }
    return result.length ? result : false;
}
function member(members, year, callback) {
    const userName = [];
    const slackId = [];
    for (const user of members) {
        if (user.length >= 13) {
            const userYear = user[4].split("");
            const yearInfo = parseInt(userYear[0], 10);
            if (year === yearInfo) {
                if (user[10]) {
                    slackId.push([user[10]]);
                    userName.push(user[0]);
                }
            }
        }
    }
    callback([userName, slackId]);
}
module.exports = (robot) => {
    const scorefield = () => {
        const field = robot.brain.get("scorefield") || {};
        robot.brain.set("scorefield", field);
        return field;
    };
    robot.respond(/score f(\d\d)( \-\w)?/i, (msg) => {
        const scoreField = scorefield();
        // obtaining the current date to calculate relative_year
        const today = new Date();
        const mm = today.getMonth() + 1;
        const yyyy = today.getFullYear();
        const yy = yyyy % 100;
        const relativeYear = mm < 7 ? yy : yy + 1;
        // <batch> whose score is to be shown
        const batch = msg.match[1];
        const year = relativeYear - Number(batch);
        util.info((body) => {
            const result = parse(body);
            if (!result) {
                return;
            }
            member(result, year, ([userNameIn, slackIdIn]) => {
                let userName = userNameIn;
                let slackId = slackIdIn;
                const userScore = [];
                if (msg.match[2] == null) {
                    userName = ["```Name", ...userName];
                    slackId = ["Score", ...slackId];
                    for (let i = 1; i <= slackId.length - 1; i++) {
                        userScore[i] = scoreField[slackId[i]] || 0;
                    }
                    userName = padright(userName);
                    const paddedScore = padleft(userScore.map((v) => String(v)));
                    const sorted = [];
                    sorted.push([userName[0], slackId[0]]);
                    for (let i = 1; i <= userName.length - 1; i++) {
                        sorted.push([userName[i], paddedScore[i]]);
                    }
                    if (sorted.length) {
                        sorted.sort((a, b) => Number(b[1]) - Number(a[1]));
                    }
                    const lines = sorted.map((val) => `${val[0]} : ${val[1]}`);
                    let response = lines.join("\n");
                    response += "```";
                    msg.send(response);
                }
                else {
                    const lastChar = msg.match[2];
                    let graphType;
                    if (lastChar === " -p") {
                        graphType = "pie";
                    }
                    else if (lastChar === " -b") {
                        graphType = "bar";
                    }
                    else {
                        return;
                    }
                    const scores = [];
                    for (let i = 0; i <= slackId.length - 1; i++) {
                        scores[i] = scoreField[slackId[i]] || 0;
                    }
                    const chart = {
                        type: graphType,
                        data: {
                            labels: userName,
                            datasets: [
                                {
                                    label: "Score",
                                    data: scores,
                                },
                            ],
                        },
                        options: {
                            plugins: {
                                datalabels: {
                                    display: true,
                                    color: "#fff",
                                },
                            },
                        },
                    };
                    const data = encodeURIComponent(JSON.stringify(chart));
                    const text = `Batch${batch} score`;
                    const alt = `Chart showing score of batch${batch}`;
                    util.graph(data, text, alt, (reply) => {
                        msg.send({ attachments: JSON.stringify(reply) });
                    });
                }
            });
        });
    });
};
//# sourceMappingURL=batch-score.js.map