export default function stripesReducer(state = {}, action) {
  switch (action.type) {
    case 'SET_PARAMS':
      state = Object.assign({}, state, { embedded: action.payload });
      break;
  }
  return state;
}
