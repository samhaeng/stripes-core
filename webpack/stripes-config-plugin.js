// This webpack plugin generates a virtual module containing the stripes configuration
// To access this configuration simply import 'stripes-config' within your JavaScript:
//   import { okapi, config, modules } from 'stripes-config';

const assert = require('assert');
const _ = require('lodash');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const serialize = require('serialize-javascript');
const loadDefaults = require('./loadDefaults');

function appendOrSingleton(maybeArray, newValue) {
  const singleton = [newValue];
  if (Array.isArray(maybeArray)) return maybeArray.concat(singleton);
  return singleton;
}

// Generates stripes configuration for the tenant's enabled modules
function parseStripesModules(enabledModules, context, alias) {
  const moduleConfigs = {};
  _.forOwn(enabledModules, (moduleConfig, moduleName) => {
    const { stripes, description, version } = loadDefaults(context, moduleName, alias);
    const stripeConfig = Object.assign({}, stripes, moduleConfig, {
      module: moduleName,
      getModule: new Function([], `return require('${moduleName}').default;`), // eslint-disable-line no-new-func
      description,
      version,
    });
    delete stripeConfig.type;
    moduleConfigs[stripes.type] = appendOrSingleton(moduleConfigs[stripes.type], stripeConfig);
  });
  return moduleConfigs;
}

module.exports = class StripesConfigPlugin {
  constructor(options) {
    assert(_.isObject(options.modules), 'stripes-config-plugin was not provided a "modules" object for enabling stripes modules');
    this.options = _.omit(options, 'branding');
  }

  apply(compiler) {
    const enabledModules = this.options.modules;
    const moduleConfigs = parseStripesModules(enabledModules, compiler.context, compiler.options.resolve.alias);
    const mergedConfig = Object.assign({}, this.options, { modules: moduleConfigs });

    // Create a virtual module for Webpack to include in the build
    const stripesVirtualModule = `
      import branding from 'stripes-branding';
      const { okapi, config, modules } = ${serialize(mergedConfig, { space: 2 })};
      export { okapi, config, modules, branding };
    `;

    compiler.apply(new VirtualModulesPlugin({
      'node_modules/stripes-config.js': stripesVirtualModule,
    }));
  }
};
