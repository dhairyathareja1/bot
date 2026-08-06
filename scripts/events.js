"use strict";
// Description:
//   Event system related utilities
//
// Commands:
//   hubot fake event <event> - Triggers the <event> event for debugging reasons
//
// Events:
//   debug - {user: <user object to send message to>}
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const util = __importStar(require("util"));
module.exports = (robot) => {
    robot.respond(/FAKE EVENT (.*)/i, (msg) => {
        msg.send(`fake event '${msg.match[1]}' triggered`);
        robot.emit(msg.match[1], { user: msg.message.user });
    });
    robot.on("debug", (event) => {
        robot.send(event.user, util.inspect(event));
    });
};
//# sourceMappingURL=events.js.map