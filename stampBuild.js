const sh = require('shelljs');
const { version, dependencies:{ knex, lodash } } = require('./package.json');

const timestamp = new Date().toISOString();

const { stdout } = sh.exec('node -v', { silent: true });

const versionData = JSON.stringify({
  version,
  node: stdout.replace(/\n/g, ''),
  knex,
  lodash,
  timestamp
}, null, 2);

sh.exec(`echo '${versionData}' > ./routes/version.json`, { });
