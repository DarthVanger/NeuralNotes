import dotProp from 'dot-prop-immutable';

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
