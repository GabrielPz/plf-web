import express from 'express';
import next from 'next';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const port = parseInt(process.env.NEXT_PUBLIC_PORT || '3000', 10);
const host = process.env.NEXT_PUBLIC_HOST || 'localhost'; 
const dev = process.env.NEXT_PUBLIC_NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, host, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${host}:${port}`);
  });
});
