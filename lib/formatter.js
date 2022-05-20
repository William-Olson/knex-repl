const debug = require('debug')('app:formatter');
const { format } = require('sql-formatter');

const fmtOpts = {
  language: 'mysql',
  tabWidth: 2,
  keywordCase: 'upper',
  linesBetweenQueries: 2,
};

/**
 * Formats sql from the following pretty-print service api:
 * https://github.com/zeroturnaround/sql-formatter
 */
module.exports = async (rawSql, opts = fmtOpts) => {


  try {
    return { data: format(rawSql, opts) };
  }
  catch (err) {
    debug('Error:', err);
    return { err: { message: 'Format error!' } };
  }

};
