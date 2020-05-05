import { NowRequest, NowResponse } from '@now/node';
import fetch from 'node-fetch';


const GITHUB_CLIENT_ID = '***REMOVED***';
const GITHUB_CLIENT_SECRET = '***REMOVED***';
***REMOVED***

export default async (_req: NowRequest, res: NowResponse) => {
  const response = await fetch(GITHUB_GET_TOKEN_URL, {method: 'POST', body: JSON.stringify({
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    code: _req.query.code
  }), headers: {Accept: 'application/json', 'Content-type': 'application/json'}}); 

  const data = await response.json();

  res.status(200).send(data);
};
