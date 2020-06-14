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
