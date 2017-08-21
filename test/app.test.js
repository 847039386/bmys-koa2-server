const app = require('../app');
const config = require('../config')
module.exports = app.listen(config.app.testPort);
