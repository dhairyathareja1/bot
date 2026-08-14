"use strict";
// Description:
//   Fetches and sends a random quote from the internet.
//
// Dependencies:
//   node-soupselect
//   node-htmlparser
//
// Configuration:
//   NONE
//
// Commands:
//   random quote
// eslint-disable-next-line @typescript-eslint/no-var-requires
const select = require("soupselect").select;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const htmlparser = require("htmlparser");
module.exports = (robot) => {
    const fetchRandomQuote = (callback) => {
        robot.http("http://inspirationalshit.com/endlessquotesrotator.php").get()((err, res, body) => {
            if (err) {
                callback(false);
                return;
            }
            if (res.statusCode !== 200) {
                callback(false);
                return;
            }
            const handler = new htmlparser.DefaultHandler((err2, dom) => {
                if (err2) {
                    callback(false);
                }
                else {
                    const quote = select(dom, "blockquote p");
                    const author = select(dom, "blockquote footer cite");
                    callback(true, quote[0].children[0].raw, author[0].children[0].raw);
                }
            });
            const parser = new htmlparser.Parser(handler);
            parser.parseComplete(body);
        });
    };
    robot.respond(/.*random.*quote.*/i, (msg) => {
        fetchRandomQuote((success, quote, author) => {
            if (success) {
                msg.send(`_${quote}_ - ${author}`);
            }
            else {
                msg.send("_error_");
            }
        });
    });
    robot.on("send:quote", (randomMsg) => {
        fetchRandomQuote((success, quote, author) => {
            let text = randomMsg;
            if (success) {
                text = `_${quote}_ - ${author}`;
            }
            robot.send({ room: "general" }, text);
        });
    });
};
//# sourceMappingURL=random-quote.js.map