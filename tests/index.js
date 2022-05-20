const test = require('tape');
const req = require('request-promise');

const TEST_URL = process.env.CI_URL || 'http://127.0.0.1:9933';


test('is available', async t => {


  // fetch page
  const result = await req({
    uri: TEST_URL,
    json: true
  });

  t.is(result.includes('knexrepl'), true);

  t.end();
});




test('version is served', async t => {


    // fetch version
    const result = await req({
      uri: TEST_URL + '/version',
      json: true
    });

    t.is(typeof result.version, 'string');
    t.is(typeof result.timestamp, 'string');

    t.end();
  });
