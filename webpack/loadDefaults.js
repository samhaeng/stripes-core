const path = require('path');
const assert = require('assert');
const _ = require('lodash');

// Loads description, version, and stripes configuration from a module's package.json
module.exports = function loadDefaults(context, moduleName, alias) {
  let aPath;
  if (alias[moduleName]) {
    aPath = require.resolve(path.join(alias[moduleName], 'package.json'));
  } else {
    try {
      aPath = require.resolve(path.join(context, 'node_modules', moduleName, '/package.json'));
    } catch (e) {
      try {
        // The above resolution is overspecific and prevents some use cases eg. yarn workspaces
        aPath = require.resolve(path.join(moduleName, '/package.json'));
      } catch (e2) {
        try {
          // This better incorporates the context path but requires nodejs 9+
          aPath = require.resolve(path.join(moduleName, '/package.json'), { paths: [context] });
        } catch (e3) { throw e3; }
      }
    }
  }

  const { stripes, description, version } = require(aPath); // eslint-disable-line
  assert(_.isObject(stripes, `included module ${moduleName} does not have a "stripes" key in package.json`));
  assert(_.isString(stripes.type, `included module ${moduleName} does not specify stripes.type in package.json`));
  return { stripes, description, version };
};
