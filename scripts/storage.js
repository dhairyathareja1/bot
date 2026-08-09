"use strict";
// Description:
//   Inspect the data in redis easily
//
// Commands:
//   hubot show users - Display all users that hubot knows about
//   hubot show storage - Display the contents that are persisted in the brain
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
const Util = __importStar(require("util"));
module.exports = (robot) => {
    robot.respond(/show storage$/i, (msg) => {
        const output = Util.inspect(robot.brain.data, false, 4);
        msg.send(output);
    });
    robot.respond(/show users$/i, (msg) => {
        let response = "";
        for (const key of Object.keys(robot.brain.data.users)) {
            const user = robot.brain.data.users[key];
            response += `${user.id} ${user.name}`;
            if (user.email_address) {
                response += ` <${user.email_address}>`;
            }
            response += "\n";
        }
        msg.send(response);
    });
};
//# sourceMappingURL=storage.js.map