// Shared helpers used by several scripts (some still CoffeeScript, e.g.
// info.coffee, leaderboard.coffee, httpd.coffee — not yet migrated).
//
// IMPORTANT: keep exports as `exports.info` / `exports.graph` (not a default
// export). Those still-CoffeeScript scripts call `require('./util').info(...)`
// and `require('./util').graph(...)` directly — changing this to ES module
// syntax breaks them even though they're never re-compiled themselves.
// eslint-disable-next-line @typescript-eslint/no-var-requires
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