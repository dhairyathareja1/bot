// Shared helpers for member-spreadsheet lookups and QuickChart payloads.
// Used by info, birthday, batch-score, leaderboard, detailed-score,
// most-spoken-words and httpd scripts.

import { https } from "follow-redirects";

export interface GraphAttachment {
  color: string;
  blocks: Array<{
    type: string;
    title: { type: string; text: string };
    image_url: string;
    alt_text: string;
  }>;
}

export type GraphCallback = (attachments: GraphAttachment[]) => void;

/**
 * Fetches the INFO_SPREADSHEET_URL sheet as CSV.
 * The callback receives exactly one of: an Error, or the CSV body.
 */
export function info(callback: (err: Error | null, body?: string) => void): void {
  const spreadsheetUrl = process.env.INFO_SPREADSHEET_URL;
  if (!spreadsheetUrl) {
    callback(new Error("INFO_SPREADSHEET_URL is not configured"));
    return;
  }

  let output = "";
  let complete = false;
  const finish = (err: Error | null, body?: string): void => {
    if (complete) {
      return;
    }
    complete = true;
    callback(err, body);
  };

  const request = https.get(`${spreadsheetUrl}?output=csv`, (res) => {
    if (res.statusCode != null && res.statusCode >= 400) {
      res.resume();
      finish(new Error(`member spreadsheet returned HTTP ${res.statusCode}`));
      return;
    }
    res.on("data", (chunk: string | Buffer) => {
      output += chunk;
    });
    res.on("end", () => {
      finish(null, output);
    });
    res.on("error", (err: Error) => {
      finish(err);
    });
  });
  request.on("error", (err: Error) => {
    finish(err);
  });
}

/** Builds a Slack image attachment pointing at a QuickChart render. */
export function graph(
  encUrl: string,
  text: string,
  altText: string,
  callback: GraphCallback,
): void {
  const attachments: GraphAttachment[] = [
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
}
