// Description:
// Returns the number of likes on MDG page on FB
//
// Dependencies:
//   None
//
// Configuration:
//   FB_APP_ACCESS_TOKEN
//
// Commands:
//   hubot fb likes

import { Robot } from "hubot";

export = (robot: Robot): void => {
  robot.respond(/fb(\s*)likes/i, (msg) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const https = require("https");
    https.get(
      {
        host: "graph.facebook.com",
        path: `/mdgiitr?access_token=${process.env.FB_APP_ACCESS_TOKEN}&fields=fan_count`,
      },
      (res: any) => {
        let data = "";
        res.on("data", (chunk: string) => {
          data += chunk.toString();
        });
        res.on("end", () => {
          console.log(data);
          const parsed = JSON.parse(data);
          msg.send(`${parsed["fan_count"]}`);
        });
      },
    );
  });
};
