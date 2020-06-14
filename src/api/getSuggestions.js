import mockData from '../data/movies';

// Mock for API GET /find
// Todo: Call real API here. The Endpoint should supports query.title as "partial text search" option
async function apiFind(query) {
  const { title } = query;
  const result = mockData.filter((item) => {
    return item && item.title && item.title.toLocaleLowerCase().includes(title.toLocaleLowerCase());
  });
  return result;
}

/**
 * Returns a list of "suggestions" as strings for given text value form the API
 */
export async function getSuggestions(forValue = '') {
  console.time(`getSuggestions(${forValue})`);
  let result;
  try {
    const fetchedData = await apiFind({ title: forValue });

    // Convert objects to "suggestions" strings
    result = fetchedData.map((item) => item.title);

    // Data fetching complete
    console.log(`getSuggestions(${forValue}) - successful, result:`, result);
    return result;
  } catch (error) {
    console.error(`getSuggestions(${forValue}) - `, error);
  } finally {
    console.timeEnd(`getSuggestions(${forValue})`);
  }
}
