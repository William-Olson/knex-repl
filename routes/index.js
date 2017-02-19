const Executor = require('../lib/Executor');
const formatter = require('../lib/formatter');

module.exports = class Routes {

  constructor({ harness })
  {
    harness.get('/', this.getRoot);
    harness.post('/parse', this.parse);
  }

  async getRoot(req, res)
  {
    res.render('index', { title: 'Express' });
  }

  async parse(req)
  {
    const executor = new Executor();
    const toParse = req.body.code;

    // exec the code
    executor.input(toParse);
    const [ res, err ] = executor.getResultOrErrStr();
    if (err) {
      throw new Error(err);
    }

    // format the output
    const result = await formatter(res);
    if (result.err) {
      throw new Error(result.err.message);
    }

    return result.data;
  }
};


