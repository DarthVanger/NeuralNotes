const localStorageKey = 'MindMapLoadedFromMemoryNotification.dontShowAagain';
export const saveDontShowAgain = () => {
  localStorage.setItem(localStorageKey, JSON.stringify(true));
};

export const getDontShowAgain = () => {
  const value = localStorage.getItem(localStorageKey);
  if (!value) return false;
  return JSON.parse(value);
};
