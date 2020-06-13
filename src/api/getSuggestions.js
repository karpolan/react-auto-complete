import mockData from '../data/movies';

/**
 * Returns a list of "suggestions" as strings for given text value
 */
export async function getSuggestions(forValue) {
  console.time('getSuggestions()');
  let result;
  try {
    // Todo: Call API here. The Endpoint should supports "partial text search" as a parameter
    const fetchedData = mockData;

    // Convert objects to "suggestions" strings
    result = fetchedData.map((item) => item.title);

    console.log(`getSuggestions(${forValue}) - successful, result`, result);
    return result;
  } catch (error) {
    console.error('getSuggestions() - ', error);
  } finally {
    console.timeEnd('getSuggestions()', 'ended');
  }
}
