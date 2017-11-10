// Applies overrides to the webpack configuration
// Supports a function or an array of functions

module.exports = function applyWebpackOverrides(overrides, originalConfig) {
  let config = originalConfig;

  if (overrides && typeof overrides === 'function') {
    config = overrides(config);
  } else if (overrides && Array.isArray(overrides)) {
    for (let i = 0; i < overrides.length; i++) {
      if (overrides[i] && typeof overrides[i] === 'function') {
        config = overrides[i](config);
      }
    }
  }

  return config;
};
