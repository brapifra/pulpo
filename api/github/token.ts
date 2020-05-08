import { NowRequest, NowResponse } from "@now/node";
import Config from "../../src/config";
import fetch from "node-fetch";

export default async (_req: NowRequest, res: NowResponse) => {
  const response = await fetch(Config.GITHUB_GET_TOKEN_URL!, {
    method: "POST",
    body: JSON.stringify({
      client_id: Config.GITHUB_CLIENT_ID,
      client_secret: Config.GITHUB_CLIENT_SECRET,
      code: _req.query.code,
    }),
    headers: { Accept: "application/json", "Content-type": "application/json" },
  });

  const data = await response.json();

  res.status(200).send(data);
};
