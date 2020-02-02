import dotProp from 'dot-prop-immutable';

/**
 * Creates a function which transforms arg list to objekt with followed keys
 *
 * Example:
 *
 * const changeParentPayloadCreator = withPayload('nodeId', 'nextParentId');
 * const payload = changeParentPayloadCreator(1001, 2000);
 * // payload = {
 * //   nodeId: 1001,
 * //   nextParentId: 2000,
 * // }
 *
 * You can pass also an object in array if you want to pass some values to payload
 */
export const withPayload = (...keys) => {
  const createPayload = (...args) => {
    return keys.reduce((payload, property, index) => {
      if (typeof property === 'object') {
        Object.assign(payload, property);
      } else {
        payload[property] = args[index];
      }

      return payload;
    }, {});
  };

  return createPayload;
};

/**
 * Shorthand to update substate
 *
 * @param {*} name - property name to update
 * @param {*|Function} updater - next value or function to update
 */
export const updateState = (name, updater) => {
  const reducer = (state, { payload }) => {
    const nextValue =
      typeof updater === 'function' ? updater(state[name], payload) : updater;
    const nextState = dotProp.set(state, name, nextValue);

    return nextState;
  };

  return reducer;
};
