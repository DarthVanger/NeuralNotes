import { MIND_MAP_LOADED_FROM_MEMORY_NOTIFICATION_CLOSED } from './MindMapLoadedFromMemoryNotificationActions';

const defaultState = {
  wasNotificationClosed: false,
};

export const mindMapLoadedFromMemoryNotficationReducer = (
  state = defaultState,
  { type },
) => {
  switch (type) {
    case MIND_MAP_LOADED_FROM_MEMORY_NOTIFICATION_CLOSED:
      return {
        ...state,
        wasNotificationClosed: true,
      };
    default:
      return state;
  }
};
