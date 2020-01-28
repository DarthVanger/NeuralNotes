export function debounce(func, wait) {
  var timeout;

  return function() {
    var context = this,
      args = arguments;

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}
