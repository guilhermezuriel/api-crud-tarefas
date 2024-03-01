import http from 'node:http';
import { json } from './middleware/json.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res); //Espera carregar todos os dados do body e transforma-os de JSON para Object
  const route = routes.find((route) => {
    return route.method === method; //Observa se o método requisitado exige em routes.js
  });
  if (route) {
    return route.handler(req, res);
  }
  return res.writeHead(404).end('Not Found');
});

server.listen(3335);
