// used by info.coffee, leaderboard.coffee, httpd.coffee
// keep exports.graph and exports.info syntax to prevent error since many other files use this in this form

const https = require("follow-redirects").https;

type InfoCallback = (output: string | Error) => void;

// Get the user details
exports.info = (callback: InfoCallback): void => {
  let output = "";
  https.get(`${process.env.INFO_SPREADSHEET_URL}?output=csv`, (res: any) => {
    res.on("data", (body: string) => {
      output += body;
    });
    res.on("end", () => {
      callback(output);
    });
    res.on("error", (err: Error) => {
      callback(err);
    });
  });
};

type GraphCallback = (attachments: any[]) => void;

// Graph Attachment
exports.graph = (
  encUrl: string,
  text: string,
  altText: string,
  callback: GraphCallback,
): void => {
  const attachments = [
    {
      color: "#f2c744",
      blocks: [
        {
          type: "image",
          title: {
            type: "plain_text",
            text,
          },
          image_url: `https://quickchart.io/chart?c=${encUrl}`,
          alt_text: altText,
        },
      ],
    },
  ];
  callback(attachments);
};
