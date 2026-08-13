"use strict";
// Description:
//   YouTube video search
//
// Configuration:
//   HUBOT_YOUTUBE_API_KEY - Obtained from https://console.developers.google.com
//   HUBOT_YOUTUBE_DETERMINISTIC_RESULTS - Optional boolean flag to only fetch
//     the top result from the YouTube search
//   HUBOT_YOUTUBE_HEAR - Optional boolean flag to globally hear from channels
// Commands:
//   hubot youtube me <query> - Searches YouTube for the query and returns the video embed link.
module.exports = (robot) => {
    let resType = "respond";
    let trigger = /(?:youtube|yt)(?: me)? (.*)/i;
    if (process.env.HUBOT_YOUTUBE_HEAR === "true") {
        resType = "hear";
        trigger = /^(?:youtube|yt)(?: me)? (.*)/i;
    }
    const handler = (msg) => {
        if (!process.env.HUBOT_YOUTUBE_API_KEY) {
            robot.logger.error("HUBOT_YOUTUBE_API_KEY is not set.");
            msg.send("You must configure the HUBOT_YOUTUBE_API_KEY environment variable");
            return;
        }
        const query = msg.match[1];
        const maxResults = process.env.HUBOT_YOUTUBE_DETERMINISTIC_RESULTS === "true" ? 1 : 15;
        robot.logger.debug(`Query: ${query}\n Max Results: ${maxResults}`);
        robot
            .http("https://www.googleapis.com/youtube/v3/search")
            .query({
            order: "relevance",
            part: "snippet",
            type: "video",
            maxResults: maxResults,
            q: query,
            key: process.env.HUBOT_YOUTUBE_API_KEY,
        })
            .get()((err, res, body) => {
            robot.logger.debug(body);
            if (err) {
                robot.logger.error(err);
                robot.emit("error", err, msg);
                return;
            }
            let videos;
            try {
                if (res.statusCode === 200) {
                    videos = JSON.parse(body);
                    robot.logger.debug(`Videos: ${JSON.stringify(videos)}`);
                }
                else {
                    robot.emit("error", `${res.statusCode}: ${body}`, msg);
                    return;
                }
            }
            catch (error) {
                robot.logger.error(error);
                msg.send(`Error! ${body}`);
                return;
            }
            if (videos.error) {
                robot.logger.error(videos.error);
                msg.send(`Error! ${JSON.stringify(videos.error)}`);
                return;
            }
            videos = videos.items;
            if (!videos || videos.length === 0) {
                msg.send(`No video results for "${query}"`);
                return;
            }
            const video = msg.random(videos);
            msg.send(`https://www.youtube.com/watch?v=${video.id.videoId}`);
        });
    };
    robot[resType](trigger, handler);
};
//# sourceMappingURL=youtube.js.map