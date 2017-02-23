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
    const [ res, errMsg ] = executor.getResultOrErrStr();
    if (errMsg) {
      throw new Error(errMsg);
    }

    // format the output
    const { data, err } = await formatter(res);
    if (err) {
      throw new Error(err.message);
    }

    return data;
  }
};


