/**
 * Stripes meta data plugin
 */
const path = require('path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const loadDefaults = require('./loadDefaults');
const serialize = require('serialize-javascript');

function processIcons(icons, compiler) {
  return Object.keys(icons).map(key => {
    const fileName = icons[key].fileName;
    const filePath = require.resolve(path.join(compiler.context, 'node_modules', '@folio/users', `/icons/${fileName}`));
    return icons[key];
  });
}

function parseStripesModules(enabledModules, compiler, alias) {
  return Object.keys(enabledModules).reduce((acc, moduleName) => {
    // console.log('load defaults', loadDefaults(context, moduleName, alias));
    const stripes = loadDefaults(compiler.context, moduleName, alias).stripes;
    return Object.assign(acc, { [moduleName.replace('@folio/', '')]: Object.assign(stripes, {
      icons: processIcons(stripes.icons, compiler),
    }) });
  }, {});
}

module.exports = class StripesConfigPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const load = parseStripesModules(this.options.modules, compiler, compiler.options.resolve.alias);
    console.log('compiler.options.resolve.alias', compiler.options.resolve.alias);
    // const what = require.resolve(path.join(compiler.options.resolve.alias['@folio/users'], 'package.json'));

    // console.log('what', what);
    const users = load['@folio/users'];
    // const icons = users.icons;
    // console.log('Users', users);
    // console.log('Icons', icons);
    // Create a virtual module for Webpack to include in the build
    const stripesVirtualModule = `
      export = ${serialize(users, { space: 2 })};
    `;

    compiler.apply(new VirtualModulesPlugin({
      'node_modules/stripes-metadata.json': stripesVirtualModule,
    }));
  }
};
