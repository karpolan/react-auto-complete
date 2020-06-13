import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { getSuggestions } from '../../api';
import AutoComplete from '../AutoComplete';

// Todo: Use lodash or other library with full featured "debounce" function
function debounce(fn, time) {
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

/**
 * Wrapper for AutoComplete component to fetch Suggestions via API when the Value is changed
 * @param {number} props.debounceInterval - interval for "debounce" timeout
 */
const AutoCompleteWithDataFetch = (props) => {
  const {
    debounceInterval = 250, // Quarter of second by default
  } = props;
  const [suggestions, setSuggestions] = useState([]); // Empty array by default

  // Calls fetchData() no frequently than debounceInterval timeout
  const debouncedHandler = useCallback(
    debounce((value) => fetchData(value), debounceInterval),
    []
  );

  // Loads suggestions list for given value from the API
  const fetchData = async (forValue) => {
    const newSuggestions = await getSuggestions(forValue);
    setSuggestions(newSuggestions);
  };

  // Comes from wrapped AutoComplete component on every key/char press
  const handleOnChange = (newValue) => {
    debouncedHandler(newValue);
  };

  return <AutoComplete suggestions={suggestions} onChange={handleOnChange} />;
};

AutoCompleteWithDataFetch.propTypes = {
  debounceInterval: PropTypes.number,
};

export default AutoCompleteWithDataFetch;
