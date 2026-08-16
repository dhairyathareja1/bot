// Description:
//   A simple interaction with the built in HTTP Daemon
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   None
//
// URLS:
//   /hubot/version
//   /hubot/ping
//   /hubot/time
//   /hubot/info
//   /hubot/ip

import { Robot } from "hubot";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const spawn = require("child_process").spawn;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const util = require("./util");

function parse(json: string, query: string): string[][] {
  const result: string[][] = [];
  for (const line of json.toString().split("\n")) {
    const y = line.toLowerCase().indexOf(query);
    if (y !== -1) {
      result.push(line.split(",").map((s) => s.trim()));
    }
  }
  // Original CoffeeScript: `if result != "" then result else false`.
  // `result` is always an array, which is never `!=`-equal to a string in a
  // way that resolves false — the comparison is always true, so the `else
  // false` branch never executes. parse() always returns the array (even
  // when empty), never `false`. Preserved exactly, not "fixed."
  return result;
}

export = (robot: Robot): void => {
  robot.router.get("/hubot/version", (req, res) => {
    res.end(robot.version);
  });

  robot.router.post("/hubot/ping", (req, res) => {
    res.end("PONG");
  });

  robot.router.get("/hubot/time", (req, res) => {
    res.end(`Server time is: ${new Date()}`);
  });

  robot.router.get("/hubot/info", (req, res) => {
    const child = spawn("/bin/sh", [
      "-c",
      "echo I\\'m $LOGNAME@$(hostname):$(pwd) \\($(git rev-parse HEAD)\\)",
    ]);

    child.stdout.on("data", (data: Buffer) => {
      res.end(
        `${data.toString().trim()} running node ${process.version} [pid: ${process.pid}]`,
      );
      child.stdin.end();
    });
  });

  robot.router.get("/hubot/ip", (req, res) => {
    robot.http("http://ifconfig.me/ip").get()((err, r, body) => {
      res.end(body);
    });
  });

  robot.router.post("/hubot/slack", (request, response) => {
    const check = process.env.HUBOT_ENV_AUTH_TOKEN;

    if (request.headers.authorization === check) {
      const data = request.body;
      let responseobj: any = {};
      if (data.queryResult.parameters.name === "") {
        console.log(data.queryResult.parameters.any);
        robot.send(
          { room: "general" },
          `Announcement : '${data.queryResult.parameters.any}'`,
        );
      } else {
        const query = data.queryResult.parameters.name.toLowerCase();
        util.info((body: string) => {
          const results = parse(body, query);
          console.log(results.length);
          if (results.length === 0) {
            responseobj = {
              fulfillmentText: "This is a text response",
              fulfillmentMessages: [],
              source: " ",
              payload: {
                google: {
                  expectUserResponse: true,
                  richResponse: {
                    items: [
                      {
                        simpleResponse: {
                          textToSpeech: "No user found",
                        },
                      },
                    ],
                  },
                },
              },
            };
          } else {
            if (results.length === 1) {
              responseobj = {
                fulfillmentText: "This is a text response",
                fulfillmentMessages: [],
                source: " ",
                payload: {
                  google: {
                    expectUserResponse: true,
                    richResponse: {
                      items: [
                        {
                          simpleResponse: {
                            textToSpeech: "Here it is",
                          },
                        },
                        {
                          basicCard: {
                            formattedText:
                              "Github : " +
                              results[0][8] +
                              "\n  \nMobile : " +
                              results[0][1] +
                              "\n  \nEmail : " +
                              results[0][2] +
                              "\n  \n" +
                              results[0][4] +
                              "    " +
                              results[0][5] +
                              "    (" +
                              results[0][6] +
                              ")",
                            title: results[0][0],
                          },
                        },
                      ],
                    },
                  },
                },
              };
            } else {
              const basicCardArray = [];
              for (const user of results) {
                const basicCardArray1 = {
                  description:
                    "Github : " +
                    user[8] +
                    "\nMobile : " +
                    user[1] +
                    "\nEmail : " +
                    user[2] +
                    "\n" +
                    user[4] +
                    "       " +
                    user[5] +
                    "   (" +
                    user[6] +
                    ")",
                  title: user[0],
                  openUrlAction: {
                    url: "https://github.com/" + user[8],
                  },
                };
                basicCardArray.push(basicCardArray1);
              }
              responseobj = {
                fulfillmentText: "This is a text response",
                fulfillmentMessages: [],
                source: " ",
                payload: {
                  google: {
                    expectUserResponse: true,
                    richResponse: {
                      items: [
                        {
                          simpleResponse: {
                            textToSpeech: "Here it is",
                          },
                        },
                        {
                          carouselBrowse: {
                            items: basicCardArray,
                          },
                        },
                      ],
                    },
                  },
                },
              };
            }
          }
          console.log(responseobj);
          response.writeHead(200, {
            "Content-Type": "application/json",
          });
          response.end(JSON.stringify(responseobj));
        });
      }
    } else {
      console.log("unauthorized request");
      response.writeHead(404);
    }
  });
};
