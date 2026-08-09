// used by info.coffee, leaderboard.coffee, httpd.coffee
// keep exports.graph and exports.info syntax to prevent error since many other files use this in this form
const https = require("follow-redirects").https;
// Get the user details
exports.info = (callback) => {
    let output = "";
    https.get(`${process.env.INFO_SPREADSHEET_URL}?output=csv`, (res) => {
        res.on("data", (body) => {
            output += body;
        });
        res.on("end", () => {
            callback(output);
        });
        res.on("error", (err) => {
            callback(err);
        });
    });
};
// Graph Attachment
exports.graph = (encUrl, text, altText, callback) => {
    const attachments = [
        {
            color: "#f2c744",
            blocks: [
                {
                    type: "image",
                    title: {
                        type: "plain_text",
                        text,
                    },
                    image_url: `https://quickchart.io/chart?c=${encUrl}`,
                    alt_text: altText,
                },
            ],
        },
    ];
    callback(attachments);
};
//# sourceMappingURL=util.js.map