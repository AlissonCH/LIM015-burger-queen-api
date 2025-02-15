require('dotenv').config();
const app = require('./server');
const config = require('./config');

const { port } = config;
require('./database');

const main = async () => {
  await app.listen(port);
  console.info(`App listening on port ${port}`);
};
main();
