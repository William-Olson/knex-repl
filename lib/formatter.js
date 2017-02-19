const debug = require('debug')('app:formatter');
const request = require('request-promise');

/**
 * Fetches formatted sql from the following pretty-print service api:
 * https://github.com/sqlparser/sql-pretty-printer/wiki/SQL-FaaS#2-api
 */
module.exports = async str => {

  // don't capitalize table names
  const fmtOpts = {
    capitalization: {
      identifier: {
        tableName: {
          sqlid: 10219632,
          fmt105_case_table_name: 'no_change'
        }
      }
    }
  };

  try {
    const data = await request({
      method: 'POST',
      json: true,
      url: 'http://www.gudusoft.com/format.php',
      form: {
        rqst_input_sql: str,
        rqst_formatOptions: JSON.stringify(fmtOpts)
      }
    });

    if (data.rspn_http_status !== 200) {
      debug(`Error: Bad resp status code ${data.rspn_http_status}`);
      return { err: { message: 'Format error!' } };
    }

    return { data: data.rspn_formatted_sql };
  }
  catch (err) {
    debug('Error:', err);
    return { err: { message: 'Format error!' } };
  }

};
