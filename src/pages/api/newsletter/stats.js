export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).send({ message: 'Only GET requests allowed' });
    return;
  }

  // get newsletter subscriber count from ConvertKit API
  const response = await fetch(
    `https://api.convertkit.com/v3/subscribers?api_secret=${process.env.CONVERTKIT_API_SECRET}`
  );
  const json = await response.json();

  const stats = {
    subscriberCount: json.total_subscribers,
  };
  res.status(200).json(stats);
}
