const test = require('tape');
const req = require('request-promise');


test('is available', async t => {


  // fetch page
  const result = await req({
    uri: 'http://localhost:9933',
    json: true
  });

  t.is(result.includes('knexrepl'), true);

  t.end();
});




test('version is served', async t => {


    // fetch version
    const result = await req({
      uri: 'http://localhost:9933/version',
      json: true
    });

    t.is(typeof result.body.version, 'string');
    t.is(typeof result.body.timestamp, 'string');

    t.end();
  });
