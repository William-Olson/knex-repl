const cuid = require('cuid');
const fs = require('fs');
const path = require('path');
const sh = require('shelljs');

module.exports = class KnexExecutor {

  constructor(dialect = 'pg')
  {
    this._input = '';
    this._dialect = dialect;
  }

  input(val='')
  {
    this._input = val;
  }

  getResultOrErr()
  {
    if (!this._input) {
      return [ '', null ];
    }

    this._input = this._input.trim();

    // f semicolons
    this._input = this._input.replace(/;/gim, '');

    if (!this._input.endsWith('toString()')) {
      this._post = '\n.toString() );';
    }
    else {
      this._post = ');';
    }

    if (!this._input.startsWith('const knex')) {
      this._pre =
        'const knexClient = require(\'knex\');\n' +
        `const knex = knexClient({ dialect: '${this._dialect}'});\n` +
        'console.log(\n';
    }

    const filename = path.join(__dirname, `${cuid.slug()}.js`);

    // write the program to a file then execute it
    fs.writeFileSync(filename, `${this._pre}${this._input}${this._post}`);
    const { stdout, stderr } = sh.exec(`node ${filename}`, {silent: true});

    console.log('FILE CONTENTS:');
    console.log('-------------------\n');
    sh.exec(`cat ${filename}`);
    console.log('\n\n-------------------');

    // delete the file
    fs.unlink(filename);

    // return results if all went well
    if (stdout) {
      return [ stdout, null ];
    }

    // otherwise pop out the path from err message and
    // return it as a string
    const errs = stderr.split('\n');
    errs.shift();
    return [ null, `\n${errs.join('\n')}` ];
  }
};

