import https from 'https';

const urls = [
  'https://images.unsplash.com/photo-1585659722983-38ca1c410ea1', // Orig Plomberie
  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e', // Orig Elec
  'https://images.unsplash.com/photo-1562259949-e8e7689d7828', // Orig Peinture
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e', // Orig Maconnerie
  'https://images.unsplash.com/photo-1598520106830-8d18449c25f7', // Orig Menuiserie
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', // Orig Archi
  'https://images.unsplash.com/photo-1541888086425-d81bb1904081', // Orig Hero
  'https://images.unsplash.com/photo-1541123437800-1bb1317badc2', // Orig Mission
  // My additions:
  'https://images.unsplash.com/photo-1504148455328-c376907d081c',
  'https://images.unsplash.com/photo-1589939705384-5185138a047a',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
  'https://images.unsplash.com/photo-1503387762-592dea58ef23',
  'https://images.unsplash.com/photo-1603533867307-b354255e3c32',
  'https://images.unsplash.com/photo-159742324403d-112502844332',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
  'https://images.unsplash.com/photo-1521791136064-7986c2923216'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => {
      resolve({ url, status: 'error' });
    }).end();
  });
}

(async () => {
  for (const url of urls) {
    const res = await checkUrl(url);
    console.log(res.status, res.url);
  }
})();
