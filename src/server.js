import http from 'node:http';
import { json } from './middleware/json.js';
import { routes } from './routes.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  await json(req, res); //Espera carregar todos os dados do body e transforma-os de JSON para Object
  const route = routes.find((route) => {
    return route.method === method; //Observa se o método requisitado exige em routes.js
  });
  if (route) {
    const routeParams = req.url.match(route.path);
    const { query, ...params } = routeParams.groups;
    req.params = params;
    req.query = query ? extractQueryParams(query) : {};
    return route.handler(req, res);
  }
  return res.writeHead(404).end('Not Found');
});

server.listen(3335);
