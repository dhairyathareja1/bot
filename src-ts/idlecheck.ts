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

import { Robot } from 'hubot';

const setTime = parseFloat(process.env.IDLE_TIME_DURATION_HOURS || '0');
let i: ReturnType<typeof setInterval> | 0 = 0;
const msecPerHour = 1000 * 60 * 60;
let lastMsgTime: Date | null = null;
// Preserved from the original — defined but never referenced there either.
const idleMsgs = ['Why so silent?', 'Is anyone alive :expressionless:', 'Looks like I am all alone!'];

export = (robot: Robot): void => {
  const checkAndSendMsg = (): void => {
    const idleTimeHour = (new Date().getTime() - (lastMsgTime as Date).getTime()) / msecPerHour;
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
