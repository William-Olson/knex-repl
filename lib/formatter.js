const request = require('request-promise');

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

module.exports = (str) => {

  return request({
    method: 'POST',
    json: true,
    url: 'http://www.gudusoft.com/format.php',
    form: {
      rqst_input_sql: str,
      rqst_formatOptions: JSON.stringify(fmtOpts)
    }
  })
    .then(data => {
      if (data.rspn_http_status !== 200) {
        return { err: { message: 'Format error!' } };
      }
      return { data: data.rspn_formatted_sql };
    })
  .catch(() => ({ err: { message: 'Format error!' } }));
};
