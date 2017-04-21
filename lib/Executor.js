const debug = require('debug')('app:executor');
const cuid = require('cuid');
const fs = require('fs');
const path = require('path');
const sh = require('shelljs');

/**
 * Saves query input to a file with a reference to knex and executes its
 * toString output.
 */
module.exports = class Executor {

  constructor(dialect = 'pg')
  {
    this._input = '';
    this._dialect = dialect;
  }

  input(val = '')
  {
    this._input = val;
  }

  getResultOrErrStr()
  {
    if (!this._input) {
      return [ '', null ];
    }

    this._input = this._input.trim();

    // remove semicolons
    this._input = this._input.replace(/;/gim, '');

    // strip requires out
    this._input = this._input.replace(/require\s*\(['"][^'"]*['"]\)/gim, '');

    this._setPreAndPost();

    const filename = path.join(__dirname, `${cuid.slug()}.js`);
    fs.writeFileSync(filename, `${this._pre}${this._input}${this._post}`);

    debug(`running file: ${filename}`);
    const { stdout, stderr } = sh.exec(`node ${filename}`, { silent: true });

    // delete the file after executed
    fs.unlink(filename, () => {});

    // return results if all went well
    if (stdout) {
      return [ stdout, null ];
    }

    // otherwise remove the path from err message and return it
    const errs = stderr.split('\n');
    errs.shift();
    return [ null, `\n${errs.join('\n')}` ];
  }

  _setPreAndPost()
  {
    this._pre =
      'const knexClient = require(\'knex\');\n' +
      'const _ = require(\'lodash\');\n' +
      'const flow = _.flow;\n' +
      `const knex = knexClient({ dialect: '${this._dialect}'});\n` +
      'console.log(\n';

    this._post =
      this._input.endsWith('toString()') ? ');' : '\n.toString() );';
  }

};

