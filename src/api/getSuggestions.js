import mockData from '../data/movies';

/**
 * Returns a list of "suggestions" to use in AutoComplete components
 */
export async function getSuggestions() {
  console.time('getSuggestions()');
  let result;
  try {
    result = mockData;
    console.log('getSuggestions() - successful, result', result);
    return result;
  } catch (error) {
    console.error('getSuggestions() - ', error);
  } finally {
    console.timeEnd('getSuggestions()', 'ended');
  }
}
