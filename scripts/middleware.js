"use strict";
// Dependencies:
//   None
//
// Configuration:
//   https://github.com/github/hubot/blob/master/docs/scripting.md#middleware
function end(msg, done) {
    // Don't process this message further.
    msg.finish();
    // Don't process further middleware.
    done();
}
module.exports = (robot) => {
    robot.receiveMiddleware((context, next, done) => {
        var _a, _b, _c, _d, _e, _f;
        const msg = context.response.message;
        // Check if message was sent by someone other than SlackBot
        if (msg.user.id !== "USLACKBOT") {
            // Check if this message was sent in a private channel
            if (((_b = (_a = msg.message) === null || _a === void 0 ? void 0 : _a.channel) === null || _b === void 0 ? void 0 : _b.is_private) ||
                ((_d = (_c = msg.rawMessage) === null || _c === void 0 ? void 0 : _c.channel) === null || _d === void 0 ? void 0 : _d.is_private)) {
                // Skipping sending the message to general channel.
                // robot.send room: 'general', "@#{msg.user.name} stop sending me messages in private channel. Talk here in public!"
                end(msg, done);
                // or a DM
            }
            else if ((_f = (_e = msg.rawMessage) === null || _e === void 0 ? void 0 : _e.channel) === null || _f === void 0 ? void 0 : _f.is_im) {
                // Skipping sending the message to general channel.
                // robot.send room: 'general', "@#{msg.user.name} pls dont DM me. Talk here in public!"
                end(msg, done);
            }
            else {
                next(done);
            }
        }
        else {
            end(msg, done);
        }
    });
};
//# sourceMappingURL=middleware.js.map