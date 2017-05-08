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



