function setParams(query={}, currentParams={}) {
  return {
    type:"SET_PARAMS", 
    payload: Object.assign(query, currentParams)
  };
}

export {
  setParams
}