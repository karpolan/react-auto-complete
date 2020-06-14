// Todo: Replace with optimized function from some popular library
export function replaceAll(str, find, replace) {
  let result;
  try {
    result = str.replace(new RegExp(find, 'g'), replace);
  } catch (error) {
    result = str; // For text with ~\./ symbols RegExp may generate the exception
  }
  return result;
}

// Todo: Use lodash or other library with full featured "debounce" function
export function debounce(fn, time) {
  let timeoutId;
  return wrapper;

  function wrapper(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}
