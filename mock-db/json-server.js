const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join('mock-db', 'db.json'));
const middlewares = jsonServer.defaults();
const rewriter = jsonServer.rewriter(require('./routes.json'));

// Add this line to load the configuration
const config = {
  watch: true,
};

// Pass the configuration to middlewares
const middlewaresWithOptions = jsonServer.defaults(config);

server.use(middlewaresWithOptions);
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
server.use(rewriter);
server.use(router);
server.listen(5001, () => {
  console.log('JSON Server is running on port 5001');
});