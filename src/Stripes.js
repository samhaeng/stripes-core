import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { refreshStore } from './mainActions';
import { isVersionCompatible } from './discoverServices';
import { setParams } from './stripesActions';

export const stripesShape = PropTypes.shape({
  logger: PropTypes.shape({
    log: PropTypes.func.isRequired,
  }).isRequired,
  connect: PropTypes.func.isRequired,
  hasPerm: PropTypes.func.isRequired,
  // XXX more
});

// Symbols used for psudo private methods
const _getUrlParams = Symbol();
const _getEmbeddedParams = Symbol();
const _setUrlParams = Symbol();
const _setEmbeddedParams = Symbol();

class Stripes {

  constructor(properties) {
    Object.assign(this, properties);
    console.log(this);
  }

  hasPerm(perm) {
    const logger = this.logger;
    if (this.config && this.config.hasAllPerms) {
      logger.log('perm', `assuming perm '${perm}': hasAllPerms is true`);
      return true;
    }
    if (!this.user.perms) {
      logger.log('perm', `not checking perm '${perm}': no user permissions yet`);
      return undefined;
    }
    logger.log('perm', `checking perm '${perm}': `, !!this.user.perms[perm]);
    return this.user.perms[perm] || false;
  }

  hasInterface(name, versionWanted) {
    const logger = this.logger;
    if (!this.discovery || !this.discovery.interfaces) {
      logger.log('interface', `not checking interface '${name}': no discovery yet`);
      return undefined;
    }
    const version = this.discovery.interfaces[name];
    if (!version) {
      logger.log('interface', `interface '${name}' is missing`);
      return undefined;
    }
    if (!versionWanted) {
      logger.log('interface', `interface '${name}' exists`);
      return true;
    }
    const ok = isVersionCompatible(version, versionWanted);
    const cond = ok ? 'is' : 'is not';
    logger.log('interface', `interface '${name}' v${versionWanted} ${cond} compatible with available v${version}`);
    return ok ? version : 0;
  }

  clone(extraProps) {
    return new Stripes(Object.assign({}, this, extraProps));
  }

  extendStripesProps(Module, extraProps={}) {
    return props => <Module {...props} stripes={this.clone(extraProps)} />;
  }

  getParams(props={}) {
    const getParamsImpl = this.embedded ? this[_getEmbeddedParams] : this[_getUrlParams];
    return getParamsImpl(props);
  }

  setParams(props={}, newParams={}) {
    props.stripes.store.dispatch(setParams(this.getParams(props), newParams));
    const setParamsImpl = this.embedded ? this[_setEmbeddedParams] : this[_setUrlParams];
    return setParamsImpl(props, newParams);
  }

  /* psudo-private methods */

  [_getUrlParams](props) {
    return props.location.search ? queryString.parse(props.location.search) : {};      
  }

  [_getEmbeddedParams](props) {
    return props.stripes.store.getState().stripes.embedded || {};      
  }

  [_setUrlParams](props, params) {
    const location = props.location;
    let query = location.query;
    if (query === undefined)
      query = queryString.parse(location.search);
  
    const allParams = Object.assign({}, query, params);
    const keys = Object.keys(allParams);
  
    let url = location.pathname;
    if (keys.length) {
      url += `?${keys.map(key => `${key}=${encodeURIComponent(allParams[key])}`).join('&')}`;
    }
  
    props.history.push(url);
  }

  [_setEmbeddedParams](props) {
    // leaves the url alone, but trigers the reloading of the route as is.
    props.history.replace(props.location.pathname);
  }

}

export default Stripes;
