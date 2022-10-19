import Airtable from 'airtable';

// var Airtable = require('airtable');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  // get the email from the request body
  const body = JSON.parse(req.body);
  const { email, name, result, log } = body;

  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );

  const { ip, geo, cookies, userAgent, referrer, headers, url } = req;

  try {
    const records = await base('Newsletter signup events').create([
      {
        fields: {
          email,
          name,
          request: JSON.stringify({
            body,
            cookies,
            geo,
            headers,
            ip,
            referrer,
            url,
            userAgent,
          }),
          result: JSON.stringify(result),
          log: JSON.stringify(log),
        },
      },
    ]);

    res.status(200).json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Something went wrong' });
  }
}
