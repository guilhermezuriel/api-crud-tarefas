import http from 'node:http';

const server = http.createServer((req, res) => {
  const { method, url } = req;
});

server.listen(3335);
