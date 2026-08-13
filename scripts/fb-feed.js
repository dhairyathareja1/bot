"use strict";
// Description:
//   Fetch random posts from any facebook page
//
// Dependencies:
//   https
//
// Configuration:
//   FB_APP_ACCESS_TOKEN
//
// Commands:
//   hubot fb feed <page-id>
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require("https");
const accessToken = `access_token=${process.env.FB_APP_ACCESS_TOKEN}`;
const options = { host: "graph.facebook.com" };
function fetchPostAttachments(postId, callback) {
    options.path = `/${postId}/?${accessToken}&fields=attachments{media},likes.limit(0).summary(true)`;
    https.get(options, (res) => {
        let postData = "";
        res.on("data", (chunk) => {
            postData += chunk.toString();
        });
        res.on("end", () => {
            const parsed = JSON.parse(postData);
            const likes = parsed.likes.summary.total_count;
            let imageUrl;
            if (parsed.attachments) {
                imageUrl = parsed.attachments.data[0].media.image.src;
            }
            callback(likes, imageUrl);
        });
    });
}
function fetchPageDetails(pageName, callback) {
    options.path = `/${pageName}?${accessToken}&fields=name,link,about,picture{url}`;
    https.get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
            data += chunk.toString();
        });
        res.on("end", () => {
            callback(JSON.parse(data));
        });
    });
}
// returns a random post from a given fb page
function getRandomPost(pageName, callback) {
    options.path = `/${pageName}/feed?${accessToken}`;
    https.get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
            data += chunk.toString();
        });
        res.on("end", () => {
            const posts = JSON.parse(data).data;
            const post = posts[Math.floor(posts.length * Math.random())];
            fetchPageDetails(pageName, (page) => {
                const output = {
                    fallback: post.message,
                    color: "#fc554d",
                    author_name: page.name,
                    author_link: page.link,
                    author_icon: page.picture.data.url,
                    title: post.message,
                    title_link: `https://facebook.com/${post.id}`,
                    ts: new Date(post.created_time).getTime() / 1000,
                };
                fetchPostAttachments(post.id, (likes, imageUrl) => {
                    output.footer = `${likes} Likes`;
                    if (imageUrl) {
                        output.image_url = imageUrl;
                    }
                    callback(output);
                });
            });
        });
    });
}
module.exports = (robot) => {
    robot.on("send:fb-feed", (pageName) => {
        getRandomPost(pageName, (data) => {
            robot.send({ room: "general" }, { attachments: [data] });
        });
    });
    robot.respond(/fb feed (.+)$/i, (msg) => {
        if (accessToken.includes("undefined")) {
            msg.send("Looks like `FB_APP_ACCESS_TOKEN` is missing :thinking_face:");
        }
        else {
            const pageName = msg.match[1].trim();
            getRandomPost(pageName, (data) => {
                msg.send({ attachments: [data] });
            });
        }
    });
};
//# sourceMappingURL=fb-feed.js.map