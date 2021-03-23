import './site-global-loading-bar.css';
import './colorful-spinner.css';

let loadersContainer = document.getElementById(
  'site-global-loading-bar-messages-container',
);
let loadingBar = document.getElementById('site-global-loading-bar');

hideLoadingBar();

let loadingMessageElement = document.createElement('div');
loadingMessageElement.className = 'site-global-loading-bar__message';

let loaderInstances = [];

let loadingBarService = {
  show: showLoadingBar,
  hide: hideLoadingBar,
  create: create,
};

export default loadingBarService;

function create(name) {
  let msgEl = loadingMessageElement.cloneNode(true);
  msgEl.innerText = 'Loading: ' + name;
  msgEl.classList.add('hidden-message');

  /**
   * Show loading message, only if spinner takes more
   * than the specified time.
   * (to not annoy user with messages on every quick action)
   */
  let showDelay = 2000;

  let isShown = false;
  let timeoutId;
  let loaderInstance = {
    name: name,
    create: function(subName) {
      return loadingBarService.create(name + ' | ' + subName);
    },
    show: function() {
      showLoadingBar();
      timeoutId = setTimeout(function() {
        if (!isShown) {
          loadersContainer.append(msgEl);
        }
        msgEl.classList.remove('hidden-message');
        isShown = true;
      }, showDelay);
    },
    hide: function() {
      window.clearTimeout(timeoutId);
      msgEl.classList.add('hidden-message');
      hideLoadingBar(name);
      let REMOVE_ANIMATION_DURATION = 2000;
      setTimeout(function() {
        msgEl.remove();
      }, REMOVE_ANIMATION_DURATION);
    },
  };
  loaderInstances.push(loaderInstance);
  return loaderInstance;
}

function showLoadingBar() {
  loadingBar.style.display = 'block';
}

function hideLoadingBar() {
  loadingBar.style.display = 'none';
}
