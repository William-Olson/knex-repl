const debug = require('debug')('app:route-harness');


/**
 * Logs all route errors and routes hit
 */
module.exports = (routeHandler, info) => {

  return async (req, res, next) => {

    try {

      debug(`${info.method} (${info.handler}) ${info.fullPath}`);
      const ret = await routeHandler(req, res);

      if (ret) {
        res.send(ret);
      }

    }
    catch (err) {
      debug(`Error in ${info.routeClass}.${info.handler}: ${err.message}`);
      next(err);
    }

  };

};
