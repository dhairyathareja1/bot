"use strict";
// Description:
// Checks if there are no messages for a fixed time and sends random posts from ToDJ.
//
// Dependencies:
//   None
//
// Configuration:
//   IDLE_TIME_DURATION_HOURS
//
// Commands:
//   None
//
// Author:
//   csoni111
const setTime = parseFloat(process.env.IDLE_TIME_DURATION_HOURS || '0');
let i = 0;
const msecPerHour = 1000 * 60 * 60;
let lastMsgTime = null;
// Preserved from the original — defined but never referenced there either.
const idleMsgs = ['Why so silent?', 'Is anyone alive :expressionless:', 'Looks like I am all alone!'];
module.exports = (robot) => {
    const checkAndSendMsg = () => {
        const idleTimeHour = (new Date().getTime() - lastMsgTime.getTime()) / msecPerHour;
        if (idleTimeHour > setTime) {
            robot.emit('send:fb-feed', 'dardanaak');
        }
    };
    if (setTime > 0) {
        robot.hear(/.+/i, (msg) => {
            lastMsgTime = new Date();
            if (i) {
                clearInterval(i);
            }
            i = setInterval(() => {
                checkAndSendMsg();
            }, msecPerHour * setTime);
        });
    }
};
//# sourceMappingURL=idlecheck.js.map